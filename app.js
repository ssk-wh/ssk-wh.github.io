import { IVRecorder } from './iv-recorder.js'

const SAMPLE_RATE = 32000
const HEARTBEAT_MS = 1000
const LOG_HEARTBEAT_EVERY = 5
const CALLBACK_GAP_WARN_MS = 350
const DRIFT_WARN_MS = 500
const DRIFT_ERROR_MS = 2000
const MAX_LOG_LINES = 600
const MAX_EVENTS = 20000
const WAVE_SAMPLES_PER_POINT = 320
const ENVELOPE_MS = 100
const ZERO_RUN_MIN_MS = 10
const SILENCE_RMS_DB = -55
const ACTIVE_RMS_DB = -42
const DIAGNOSTIC_VERSION = '3.0.0'
const WORKLET_STATS_STALL_WARN_MS = 2500
const REPEAT_WARN_HEAD = 20
const REPEAT_WARN_EVERY = 15

const $ = id => document.getElementById(id)
const elements = {
  environmentText: $('environmentText'),
  secureContextText: $('secureContextText'),
  statusBadge: $('statusBadge'),
  statusText: $('statusText'),
  caseIdInput: $('caseIdInput'),
  deviceSelect: $('deviceSelect'),
  refreshDevicesBtn: $('refreshDevicesBtn'),
  audioRouteSelect: $('audioRouteSelect'),
  aecToggle: $('aecToggle'),
  noiseToggle: $('noiseToggle'),
  agcToggle: $('agcToggle'),
  startBtn: $('startBtn'),
  pauseBtn: $('pauseBtn'),
  stopBtn: $('stopBtn'),
  markerBtn: $('markerBtn'),
  wallTimeMetric: $('wallTimeMetric'),
  contextTimeMetric: $('contextTimeMetric'),
  inputTimeMetric: $('inputTimeMetric'),
  pcmTimeMetric: $('pcmTimeMetric'),
  driftMetric: $('driftMetric'),
  driftMetricBox: $('driftMetricBox'),
  levelMetric: $('levelMetric'),
  contextMetric: $('contextMetric'),
  bufferMetric: $('bufferMetric'),
  waveformCanvas: $('waveformCanvas'),
  waveformSummary: $('waveformSummary'),
  emptyWaveform: $('emptyWaveform'),
  levelBar: $('levelBar'),
  resultSection: $('resultSection'),
  resultSummary: $('resultSummary'),
  diagnosisBox: $('diagnosisBox'),
  diagnosisTitle: $('diagnosisTitle'),
  diagnosisText: $('diagnosisText'),
  referenceAudioPlayer: $('referenceAudioPlayer'),
  referenceResultSummary: $('referenceResultSummary'),
  referencePlaybackMarkerBtn: $('referencePlaybackMarkerBtn'),
  downloadReferenceBtn: $('downloadReferenceBtn'),
  audioPlayer: $('audioPlayer'),
  ivResultSummary: $('ivResultSummary'),
  playbackMarkerBtn: $('playbackMarkerBtn'),
  sharePackageBtn: $('sharePackageBtn'),
  downloadPackageBtn: $('downloadPackageBtn'),
  downloadResultJsonBtn: $('downloadResultJsonBtn'),
  downloadWavBtn: $('downloadWavBtn'),
  logOutput: $('logOutput'),
  logSummary: $('logSummary'),
  copyLogBtn: $('copyLogBtn'),
  downloadLogBtn: $('downloadLogBtn'),
  clearLogBtn: $('clearLogBtn'),
}

let recorder = null
let state = 'idle'
let sessionId = ''
let sessionStartPerf = 0
let sessionEndPerf = 0
let pauseStartPerf = 0
let pausedTotalMs = 0
let finalOpenPauseMs = 0
let currentPause = null
let capturedSamples = 0
let capturedSamplesBaseline = 0
let pcmBufferCount = 0
let inputBufferCount = 0
let acceptedInputSamples = 0
let acceptedInputDurationMs = 0
let acceptedInputDurationBaselineMs = 0
let expectedOutputSamples = 0
let expectedOutputSamplesBaseline = 0
let rawIngressSamples = 0
let rawIngressBufferCount = 0
let rawIngressDurationMs = 0
let rawActiveSamples = 0
let rawActiveDurationMs = 0
let rawPausedSamples = 0
let rawPausedDurationMs = 0
let rawWorkletSamples = 0
let rawWorkletBufferCount = 0
let workerCompletedCount = 0
// Worklet 音频线程内部计数（iv-recorder 诊断副本每 ~1s 上报一次 workletStats）
let workletStatsBaseline = null
let workletStatsLatest = null
let workletStatsPrev = null
let workletStatsUpdates = 0
let lastWorkletStatsPerf = 0
let lastWorkletStallWarnPerf = 0
let workletEmptyInputWarns = 0
let workletQuantumGapWarns = 0
// AudioContext.renderCapacity（渲染线程负载/欠载，Chrome 支持）
let renderCapacitySupported = false
let renderCapacityLatest = null
let renderCapacityUpdates = 0
let renderCapacityUnderrunEvents = 0
let renderCapacityMaxUnderrun = 0
// MediaStreamTrack.stats（浏览器采集帧统计，Chrome 支持）
let trackStatsSupported = false
let trackStatsBaseline = null
let trackStatsFinal = null
let lastRawIngressPerf = 0
let lastWorkerCompletePerf = 0
let lastInputPerf = 0
let lastInputPlaybackTime = 0
let lastPcmPerf = 0
let latestLevelDb = -Infinity
let heartbeatTimer = null
let heartbeatCount = 0
let latestDriftMs = 0
let lastWarnedDriftMs = 0
let audioFile = null
let audioUrl = ''
let sharedMediaStream = null
let referenceRecorder = null
let referenceChunks = []
let referenceEvents = []
let referenceFile = null
let referenceUrl = ''
let referenceSnapshot = null
let referenceStartPerf = 0
let referenceStopPerf = 0
let referenceStopPromise = null
let diagnosticPackageFile = null
let wakeLock = null
let wakeLockEvents = []
let activeConfig = null
let deviceSnapshot = []
let trackSnapshot = null
let finalTrackSnapshot = null
let resultSnapshot = null
let peaksSnapshot = null
let wavAnalysis = null
let diagnosisSnapshot = null
let stopSequence = []
let events = []
let heartbeats = []
let markers = []
let pauses = []
let longTasks = []
let displayLines = []
let waveformPoints = []
let waveAccumulator = { count: 0, min: 0, max: 0 }
let pcmEnvelope = []
let rawInputEnvelope = []
let pcmEnvelopeAccumulator = null
let rawEnvelopeAccumulator = null
let contextBaselineSec = null
let contextFinalSec = null
let contextPauseStartSec = null
let contextPausedTotalSec = 0
let environmentDetails = {}
let inputTransport = 'unknown'
let renderQueued = false
let removeHealthListeners = []

function nowActiveMs() {
  if (!sessionStartPerf) return 0
  const end = sessionEndPerf || performance.now()
  const openPause = state === 'paused' && pauseStartPerf ? end - pauseStartPerf : finalOpenPauseMs
  return Math.max(0, end - sessionStartPerf - pausedTotalMs - openPause)
}

// Mirrors Animation.getCurrentUs(): an unfinished pause is not deducted until resumeRecording().
function projectClockMs() {
  if (!sessionStartPerf) return 0
  const end = sessionEndPerf || performance.now()
  return Math.max(0, end - sessionStartPerf - pausedTotalMs)
}

function pcmMs() {
  return (capturedSamples / SAMPLE_RATE) * 1000
}

function sessionPcmMs() {
  return (Math.max(0, capturedSamples - capturedSamplesBaseline) / SAMPLE_RATE) * 1000
}

function acceptedMs() {
  return Math.max(0, acceptedInputDurationMs - acceptedInputDurationBaselineMs)
}

function currentContextTimeSec() {
  if (contextFinalSec != null) return contextFinalSec
  return recorder?._AUDIO?.context?.currentTime ?? null
}

function contextClockMs() {
  const current = currentContextTimeSec()
  if (current == null || contextBaselineSec == null) return 0
  let openPauseSec = 0
  if (contextPauseStartSec != null) {
    openPauseSec = Math.max(0, current - contextPauseStartSec)
  }
  return Math.max(0, (current - contextBaselineSec - contextPausedTotalSec - openPauseSec) * 1000)
}

function clockSnapshot() {
  const projectMs = projectClockMs()
  const activeMs = nowActiveMs()
  const contextMs = contextClockMs()
  const inputMs = acceptedMs()
  const outputMs = sessionPcmMs()
  const expectedSamples = Math.max(0, Math.round(expectedOutputSamples - expectedOutputSamplesBaseline))
  const outputSamples = Math.max(0, capturedSamples - capturedSamplesBaseline)
  return {
    projectMs: Math.round(projectMs),
    effectiveActiveMs: Math.round(activeMs),
    contextMs: Math.round(contextMs),
    acceptedInputMs: Math.round(inputMs),
    outputPcmMs: Math.round(outputMs),
    expectedOutputSamples: expectedSamples,
    actualOutputSamples: outputSamples,
    driftsMs: {
      projectMinusContext: Math.round(projectMs - contextMs),
      contextMinusInput: Math.round(contextMs - inputMs),
      inputMinusOutput: Math.round(inputMs - outputMs),
      projectMinusOutput: Math.round(projectMs - outputMs),
    },
  }
}

function formatDuration(ms) {
  const safe = Math.max(0, Number.isFinite(ms) ? ms : 0)
  const minutes = Math.floor(safe / 60000)
  const seconds = Math.floor((safe % 60000) / 1000)
  const millis = Math.floor(safe % 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
}

function formatDb(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)} dBFS` : '-∞ dBFS'
}

function normalizeValue(value, depth = 0) {
  if (depth > 4) return '[max-depth]'
  if (value == null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  if (typeof value === 'bigint') return value.toString()
  if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack }
  if (ArrayBuffer.isView(value)) return { type: value.constructor.name, length: value.length }
  if (value instanceof ArrayBuffer) return { type: 'ArrayBuffer', byteLength: value.byteLength }
  if (Array.isArray(value)) return value.slice(0, 50).map(item => normalizeValue(item, depth + 1))
  if (typeof value === 'object') {
    const result = {}
    for (const key of Object.keys(value).slice(0, 80)) {
      try {
        result[key] = normalizeValue(value[key], depth + 1)
      } catch {
        result[key] = '[unavailable]'
      }
    }
    return result
  }
  return String(value)
}

function stringifyCompact(value) {
  try {
    return JSON.stringify(normalizeValue(value))
  } catch {
    return String(value)
  }
}

function addLog(level, type, data = {}) {
  const clocks = clockSnapshot()
  const item = {
    timestamp: new Date().toISOString(),
    perfMs: Math.round(performance.now()),
    projectMs: clocks.projectMs,
    activeMs: clocks.effectiveActiveMs,
    pcmMs: clocks.outputPcmMs,
    level,
    type,
    data: normalizeValue(data),
  }
  events.push(item)
  if (events.length > MAX_EVENTS) events.shift()

  const levelLabel = level.toUpperCase().padEnd(5)
  const line = `${item.timestamp.slice(11, 23)} ${levelLabel} ${type} ${stringifyCompact(item.data)}`
  displayLines.push(line)
  if (displayLines.length > MAX_LOG_LINES) displayLines.shift()
  elements.logOutput.textContent = displayLines.join('\n')
  elements.logOutput.scrollTop = elements.logOutput.scrollHeight
  elements.logSummary.textContent = `${events.length} 条事件 · ${markers.length} 个手工标记`
}

function captureSdkConsole() {
  for (const method of ['log', 'warn', 'error']) {
    const original = console[method].bind(console)
    console[method] = (...args) => {
      original(...args)
      const first = String(args[0] ?? '')
      if (first.includes('IVRecorder') || first.includes('RecorderWorker') || first.includes('AudioWorklet')) {
        addLog(method === 'log' ? 'info' : method, 'sdk.console', { message: args.map(normalizeValue) })
      }
    }
  }
}

function getConfig() {
  return {
    caseId: elements.caseIdInput.value.trim(),
    echoCancellation: elements.aecToggle.checked,
    noiseSuppression: elements.noiseToggle.checked,
    enableAGC: elements.agcToggle.checked,
    deviceId: elements.deviceSelect.value || '',
    deviceLabel: elements.deviceSelect.selectedOptions[0]?.textContent || '系统默认麦克风',
    audioRoute: elements.audioRouteSelect.value,
    audioRouteLabel: elements.audioRouteSelect.selectedOptions[0]?.textContent || '未填写',
    useVAD: false,
    outputSampleRate: SAMPLE_RATE,
  }
}

function setState(nextState, label) {
  state = nextState
  elements.statusBadge.className = `status-badge ${nextState}`
  elements.statusText.textContent = label
  const active = nextState === 'recording' || nextState === 'paused'
  const recording = nextState === 'recording'
  elements.startBtn.disabled = active || nextState === 'stopping'
  elements.pauseBtn.disabled = !active
  elements.pauseBtn.innerHTML = nextState === 'paused' ? '<span aria-hidden="true">&#9654;</span>继续' : '<span aria-hidden="true">&#8545;</span>暂停'
  elements.stopBtn.disabled = !active
  elements.markerBtn.disabled = !active
  elements.caseIdInput.disabled = active
  elements.deviceSelect.disabled = active
  elements.refreshDevicesBtn.disabled = active
  elements.audioRouteSelect.disabled = active
  elements.aecToggle.disabled = active
  elements.noiseToggle.disabled = active
  elements.agcToggle.disabled = active
}

async function refreshDevices(requestPermission = false) {
  if (!navigator.mediaDevices?.enumerateDevices) {
    addLog('error', 'device.enumerate.unsupported')
    return
  }
  let permissionStream = null
  try {
    if (requestPermission) permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(item => item.kind === 'audioinput')
    deviceSnapshot = devices.map((item, index) => ({
      deviceId: item.deviceId,
      groupId: item.groupId,
      label: item.label || `麦克风 ${index + 1}`,
    }))
    const selected = elements.deviceSelect.value
    elements.deviceSelect.replaceChildren(new Option('系统默认麦克风', ''))
    for (const [index, item] of devices.entries()) {
      const option = new Option(item.label || `麦克风 ${index + 1}`, item.deviceId)
      elements.deviceSelect.add(option)
    }
    if ([...elements.deviceSelect.options].some(option => option.value === selected)) elements.deviceSelect.value = selected
    addLog('info', 'device.enumerated', { count: devices.length, devices: deviceSnapshot })
  } catch (error) {
    addLog('error', 'device.enumerate.failed', error)
  } finally {
    permissionStream?.getTracks().forEach(track => track.stop())
  }
}

function isIPadDevice() {
  return /iPad/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function audioConstraints(config) {
  const constraints = {
    sampleRate: SAMPLE_RATE,
    channelCount: 1,
    echoCancellation: config.echoCancellation,
    noiseSuppression: config.noiseSuppression,
    autoGainControl: config.enableAGC,
  }
  if (config.deviceId) constraints.deviceId = { exact: config.deviceId }
  return constraints
}

function selectReferenceMimeType() {
  if (typeof MediaRecorder === 'undefined') return ''
  const candidates = [
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
  ]
  return candidates.find(type => MediaRecorder.isTypeSupported?.(type)) || ''
}

function referenceExtension(mimeType) {
  if (/mp4/i.test(mimeType)) return 'm4a'
  if (/ogg/i.test(mimeType)) return 'ogg'
  return 'webm'
}

function addReferenceEvent(type, data = {}) {
  const item = {
    timestamp: new Date().toISOString(),
    perfMs: Math.round(performance.now()),
    projectMs: Math.round(projectClockMs()),
    type,
    data: normalizeValue(data),
  }
  referenceEvents.push(item)
  if (referenceEvents.length > 20000) referenceEvents.shift()
  return item
}

function prepareReferenceRecorder(stream) {
  if (typeof MediaRecorder === 'undefined') throw new Error('当前浏览器不支持 MediaRecorder，无法执行双路对照')
  const requestedMimeType = selectReferenceMimeType()
  referenceRecorder = new MediaRecorder(stream, requestedMimeType ? { mimeType: requestedMimeType } : undefined)
  referenceChunks = []
  referenceEvents = []
  referenceStopPromise = new Promise((resolve, reject) => {
    referenceRecorder.addEventListener('start', () => {
      referenceStartPerf = performance.now()
      addReferenceEvent('start', { mimeType: referenceRecorder.mimeType, state: referenceRecorder.state })
      addLog('info', 'reference.started', { mimeType: referenceRecorder.mimeType })
    })
    referenceRecorder.addEventListener('dataavailable', event => {
      if (event.data?.size > 0) referenceChunks.push(event.data)
      addReferenceEvent('dataavailable', {
        size: event.data?.size || 0,
        timecode: Number.isFinite(event.timecode) ? Number(event.timecode.toFixed(3)) : null,
        chunkCount: referenceChunks.length,
      })
    })
    referenceRecorder.addEventListener('pause', () => addReferenceEvent('pause', { state: referenceRecorder.state }))
    referenceRecorder.addEventListener('resume', () => addReferenceEvent('resume', { state: referenceRecorder.state }))
    referenceRecorder.addEventListener('error', event => {
      const error = event.error || new Error('MediaRecorder error')
      addReferenceEvent('error', error)
      addLog('error', 'reference.error', error)
      reject(error)
    }, { once: true })
    referenceRecorder.addEventListener('stop', () => {
      referenceStopPerf = performance.now()
      const mimeType = referenceRecorder.mimeType || requestedMimeType || referenceChunks[0]?.type || 'audio/webm'
      const blob = new Blob(referenceChunks, { type: mimeType })
      referenceFile = new File([blob], `${sessionId}-reference.${referenceExtension(mimeType)}`, { type: mimeType })
      addReferenceEvent('stop', { mimeType, bytes: referenceFile.size, chunkCount: referenceChunks.length })
      addLog('info', 'reference.stopped', { mimeType, bytes: referenceFile.size, chunkCount: referenceChunks.length })
      resolve(referenceFile)
    }, { once: true })
  })
}

function startReferenceRecording() {
  if (!referenceRecorder || referenceRecorder.state !== 'inactive') throw new Error('原生参考录音器未就绪')
  referenceRecorder.start(1000)
}

function pauseReferenceRecording() {
  if (referenceRecorder?.state === 'recording') referenceRecorder.pause()
}

function resumeReferenceRecording() {
  if (referenceRecorder?.state === 'paused') referenceRecorder.resume()
}

function stopReferenceRecording() {
  if (!referenceRecorder) return Promise.resolve(null)
  if (referenceRecorder.state === 'inactive') return Promise.resolve(referenceFile)
  referenceRecorder.stop()
  return referenceStopPromise
}

function waitForAudioDuration(audio, timeoutMs = 8000) {
  const current = Number(audio.duration)
  if (Number.isFinite(current) && current > 0) return Promise.resolve(current)
  return new Promise(resolve => {
    let settled = false
    const finish = value => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      audio.removeEventListener('loadedmetadata', onMetadata)
      audio.removeEventListener('durationchange', onMetadata)
      resolve(Number.isFinite(value) && value > 0 ? value : null)
    }
    const onMetadata = () => finish(Number(audio.duration))
    const timer = setTimeout(() => finish(Number(audio.duration)), timeoutMs)
    audio.addEventListener('loadedmetadata', onMetadata)
    audio.addEventListener('durationchange', onMetadata)
    audio.load()
  })
}

async function finalizeReferenceResult() {
  if (!referenceFile) return null
  if (referenceUrl) URL.revokeObjectURL(referenceUrl)
  referenceUrl = URL.createObjectURL(referenceFile)
  elements.referenceAudioPlayer.src = referenceUrl
  const mediaDurationSec = await waitForAudioDuration(elements.referenceAudioPlayer)
  referenceSnapshot = {
    filename: referenceFile.name,
    mimeType: referenceFile.type,
    bytes: referenceFile.size,
    chunkCount: referenceChunks.length,
    wallDurationSec: referenceStartPerf && referenceStopPerf ? (referenceStopPerf - referenceStartPerf) / 1000 : null,
    mediaDurationSec,
    events: referenceEvents.length,
  }
  elements.referenceResultSummary.textContent = `${referenceFile.type || '浏览器默认格式'} · ${(referenceFile.size / 1024 / 1024).toFixed(2)} MiB · ${mediaDurationSec ? `${mediaDurationSec.toFixed(3)} 秒` : '时长由回放确认'}`
  elements.referencePlaybackMarkerBtn.disabled = false
  elements.downloadReferenceBtn.disabled = false
  return referenceSnapshot
}

async function requestScreenWakeLock(reason) {
  if (!navigator.wakeLock?.request) {
    if (!wakeLockEvents.some(item => item.type === 'unsupported')) {
      wakeLockEvents.push({ type: 'unsupported', reason, timestamp: new Date().toISOString() })
      addLog('info', 'wake-lock.unsupported')
    }
    return
  }
  if (wakeLock) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLockEvents.push({ type: 'acquired', reason, timestamp: new Date().toISOString() })
    addLog('info', 'wake-lock.acquired', { reason })
    wakeLock.addEventListener('release', () => {
      wakeLockEvents.push({ type: 'released', reason: 'platform', timestamp: new Date().toISOString() })
      wakeLock = null
      addLog('warn', 'wake-lock.released')
    }, { once: true })
  } catch (error) {
    wakeLockEvents.push({ type: 'failed', reason, timestamp: new Date().toISOString(), error: normalizeValue(error) })
    addLog('warn', 'wake-lock.failed', error)
  }
}

async function releaseScreenWakeLock(reason) {
  const lock = wakeLock
  wakeLock = null
  if (!lock) return
  try {
    await lock.release()
    wakeLockEvents.push({ type: 'released', reason, timestamp: new Date().toISOString() })
  } catch (error) {
    addLog('warn', 'wake-lock.release.failed', error)
  }
}

function clearSessionData() {
  sessionId = `ivdiag-${new Date().toISOString().replace(/[:.]/g, '-')}`
  events = []
  displayLines = []
  elements.logOutput.textContent = ''
  elements.logSummary.textContent = '0 条事件 · 0 个手工标记'
  sessionStartPerf = 0
  sessionEndPerf = 0
  pauseStartPerf = 0
  pausedTotalMs = 0
  finalOpenPauseMs = 0
  currentPause = null
  capturedSamples = 0
  capturedSamplesBaseline = 0
  pcmBufferCount = 0
  inputBufferCount = 0
  acceptedInputSamples = 0
  acceptedInputDurationMs = 0
  acceptedInputDurationBaselineMs = 0
  expectedOutputSamples = 0
  expectedOutputSamplesBaseline = 0
  rawIngressSamples = 0
  rawIngressBufferCount = 0
  rawIngressDurationMs = 0
  rawActiveSamples = 0
  rawActiveDurationMs = 0
  rawPausedSamples = 0
  rawPausedDurationMs = 0
  rawWorkletSamples = 0
  rawWorkletBufferCount = 0
  workerCompletedCount = 0
  workletStatsBaseline = null
  workletStatsLatest = null
  workletStatsPrev = null
  workletStatsUpdates = 0
  lastWorkletStatsPerf = 0
  lastWorkletStallWarnPerf = 0
  workletEmptyInputWarns = 0
  workletQuantumGapWarns = 0
  renderCapacitySupported = false
  renderCapacityLatest = null
  renderCapacityUpdates = 0
  renderCapacityUnderrunEvents = 0
  renderCapacityMaxUnderrun = 0
  trackStatsSupported = false
  trackStatsBaseline = null
  trackStatsFinal = null
  lastRawIngressPerf = 0
  lastWorkerCompletePerf = 0
  lastInputPerf = 0
  lastInputPlaybackTime = 0
  lastPcmPerf = 0
  latestLevelDb = -Infinity
  heartbeatCount = 0
  latestDriftMs = 0
  lastWarnedDriftMs = 0
  referenceRecorder = null
  referenceChunks = []
  referenceEvents = []
  referenceFile = null
  referenceSnapshot = null
  referenceStartPerf = 0
  referenceStopPerf = 0
  referenceStopPromise = null
  diagnosticPackageFile = null
  wakeLockEvents = []
  trackSnapshot = null
  finalTrackSnapshot = null
  resultSnapshot = null
  peaksSnapshot = null
  wavAnalysis = null
  diagnosisSnapshot = null
  stopSequence = []
  heartbeats = []
  markers = []
  pauses = []
  longTasks = []
  waveformPoints = []
  waveAccumulator = { count: 0, min: 0, max: 0 }
  pcmEnvelope = []
  rawInputEnvelope = []
  pcmEnvelopeAccumulator = null
  rawEnvelopeAccumulator = null
  contextBaselineSec = null
  contextFinalSec = null
  contextPauseStartSec = null
  contextPausedTotalSec = 0
  inputTransport = 'unknown'
  elements.emptyWaveform.hidden = false
  elements.waveformSummary.textContent = '等待录音数据'
  elements.resultSection.hidden = true
  elements.resultSummary.textContent = ''
  elements.diagnosisBox.hidden = true
  elements.diagnosisBox.className = 'diagnosis-box'
  elements.diagnosisTitle.textContent = ''
  elements.diagnosisText.textContent = ''
  elements.referenceResultSummary.textContent = '等待录制结果'
  elements.ivResultSummary.textContent = '等待录制结果'
  elements.referenceAudioPlayer.removeAttribute('src')
  elements.referenceAudioPlayer.load()
  elements.audioPlayer.removeAttribute('src')
  elements.audioPlayer.load()
  elements.referencePlaybackMarkerBtn.disabled = true
  elements.playbackMarkerBtn.disabled = true
  elements.sharePackageBtn.disabled = true
  elements.downloadPackageBtn.disabled = true
  elements.downloadResultJsonBtn.disabled = true
  elements.downloadReferenceBtn.disabled = true
  elements.downloadWavBtn.disabled = true
  if (referenceUrl) URL.revokeObjectURL(referenceUrl)
  if (audioUrl) URL.revokeObjectURL(audioUrl)
  referenceUrl = ''
  audioUrl = ''
  audioFile = null
  removeHealthListeners.forEach(remove => remove())
  removeHealthListeners = []
  queueWaveformRender()
}

function getPcmArray(payload) {
  const value = payload?.data
  if (value instanceof Int16Array) return value
  if (value instanceof ArrayBuffer) return new Int16Array(value)
  if (ArrayBuffer.isView(value)) return new Int16Array(value.buffer, value.byteOffset, Math.floor(value.byteLength / 2))
  return null
}

function createEnvelopeAccumulator(sampleRate, output) {
  return {
    sampleRate,
    output,
    targetSamples: Math.max(1, Math.round((sampleRate * ENVELOPE_MS) / 1000)),
    totalSamples: 0,
    binStartSample: 0,
    count: 0,
    sumSquares: 0,
    peak: 0,
    exactZeros: 0,
    clipping: 0,
  }
}

function commitEnvelopeBin(accumulator) {
  if (!accumulator?.count) return
  const rms = Math.sqrt(accumulator.sumSquares / accumulator.count)
  const endSample = accumulator.binStartSample + accumulator.count
  accumulator.output.push({
    index: accumulator.output.length,
    startMs: Math.round((accumulator.binStartSample / accumulator.sampleRate) * 1000),
    endMs: Math.round((endSample / accumulator.sampleRate) * 1000),
    rmsDbFS: rms > 0 ? Number((20 * Math.log10(rms)).toFixed(2)) : null,
    peakDbFS: accumulator.peak > 0 ? Number((20 * Math.log10(accumulator.peak)).toFixed(2)) : null,
    exactZeroPct: Number(((accumulator.exactZeros / accumulator.count) * 100).toFixed(2)),
    clippingPct: Number(((accumulator.clipping / accumulator.count) * 100).toFixed(4)),
  })
  accumulator.binStartSample = endSample
  accumulator.count = 0
  accumulator.sumSquares = 0
  accumulator.peak = 0
  accumulator.exactZeros = 0
  accumulator.clipping = 0
}

function appendEnvelopeValue(accumulator, sample, scale) {
    const normalized = sample / scale
    const abs = Math.abs(normalized)
    accumulator.count++
    accumulator.totalSamples++
    accumulator.sumSquares += normalized * normalized
    if (abs > accumulator.peak) accumulator.peak = abs
    if (sample === 0) accumulator.exactZeros++
    if (abs >= 0.999) accumulator.clipping++
    if (accumulator.count >= accumulator.targetSamples) commitEnvelopeBin(accumulator)
}

function appendEnvelope(accumulator, samples, length, scale = 1) {
  const safeLength = Math.min(length || samples.length, samples.length)
  for (let i = 0; i < safeLength; i++) {
    appendEnvelopeValue(accumulator, samples[i], scale)
  }
}

function flushEnvelopeAccumulators() {
  commitEnvelopeBin(pcmEnvelopeAccumulator)
  commitEnvelopeBin(rawEnvelopeAccumulator)
}

function appendWaveform(samples, length) {
  const safeLength = Math.min(length || samples.length, samples.length)
  let sumSquares = 0
  let localPeak = 0
  for (let i = 0; i < safeLength; i++) {
    const sample = samples[i]
    const normalized = sample / 32768
    const abs = Math.abs(normalized)
    sumSquares += normalized * normalized
    if (abs > localPeak) localPeak = abs
    if (waveAccumulator.count === 0) {
      waveAccumulator.min = normalized
      waveAccumulator.max = normalized
    } else {
      if (normalized < waveAccumulator.min) waveAccumulator.min = normalized
      if (normalized > waveAccumulator.max) waveAccumulator.max = normalized
    }
    waveAccumulator.count++
    if (waveAccumulator.count >= WAVE_SAMPLES_PER_POINT) {
      waveformPoints.push([waveAccumulator.min, waveAccumulator.max])
      waveAccumulator = { count: 0, min: 0, max: 0 }
    }
  }
  const rms = safeLength ? Math.sqrt(sumSquares / safeLength) : 0
  latestLevelDb = rms > 0 ? 20 * Math.log10(rms) : -Infinity
  const meter = Math.max(0, Math.min(100, ((latestLevelDb + 60) / 60) * 100))
  elements.levelBar.style.width = `${meter}%`
  elements.levelBar.style.background = localPeak > 0.9 ? '#c33d42' : localPeak > 0.65 ? '#d38b18' : '#16835f'
  elements.emptyWaveform.hidden = waveformPoints.length > 0
  if (!pcmEnvelopeAccumulator) pcmEnvelopeAccumulator = createEnvelopeAccumulator(SAMPLE_RATE, pcmEnvelope)
  appendEnvelope(pcmEnvelopeAccumulator, samples, safeLength, 32768)
  queueWaveformRender()
}

function instrumentRecorderInternals(instance) {
  const originalHandleAudioBuffer = instance._handleAudioBuffer.bind(instance)
  instance._handleAudioBuffer = samples => {
    const now = performance.now()
    const length = Number(samples?.length || 0)
    const sampleRate = instance?._AUDIO?.context?.sampleRate || SAMPLE_RATE
    const durationMs = length ? (length / sampleRate) * 1000 : 0
    rawIngressBufferCount++
    rawIngressSamples += length
    rawIngressDurationMs += durationMs

    if (state === 'recording') {
      if (lastRawIngressPerf) {
        const gapMs = now - lastRawIngressPerf
        if (gapMs > Math.max(CALLBACK_GAP_WARN_MS, durationMs * 2.5)) {
          addLog('warn', 'audio.raw-ingress.callback-gap', {
            gapMs: Math.round(gapMs),
            expectedMs: Math.round(durationMs),
            length,
            sampleRate,
            contextState: instance?._AUDIO?.context?.state,
          })
        }
      }
      rawActiveSamples += length
      rawActiveDurationMs += durationMs
      if (!rawEnvelopeAccumulator || rawEnvelopeAccumulator.sampleRate !== sampleRate) {
        commitEnvelopeBin(rawEnvelopeAccumulator)
        rawEnvelopeAccumulator = createEnvelopeAccumulator(sampleRate, rawInputEnvelope)
      }
      appendEnvelope(rawEnvelopeAccumulator, samples, length, 1)
    } else if (state === 'paused') {
      rawPausedSamples += length
      rawPausedDurationMs += durationMs
    }
    lastRawIngressPerf = now
    return originalHandleAudioBuffer(samples)
  }

  const worker = instance.recorderWorker
  if (worker?.addEventListener) {
    const workerHandler = event => {
      if (event.data?.command === 'audioProcessComplete') {
        workerCompletedCount++
        lastWorkerCompletePerf = performance.now()
      }
    }
    worker.addEventListener('message', workerHandler)
    removeHealthListeners.push(() => worker.removeEventListener('message', workerHandler))
  }
}

// worklet 内部计数快照（累计值），data 来自音频线程 postMessage
function makeWorkletSnapshot(data) {
  return {
    ...data.stats,
    currentFrame: data.currentFrame,
    currentTimeSec: data.currentTime,
    sampleRate: data.sampleRate,
    quantumSize: data.quantumSize || 128,
    active: data.active,
    atPerfMs: Math.round(performance.now()),
  }
}

function diffWorkletStats(from, to) {
  if (!from || !to) return null
  const keys = ['processCalls', 'inactiveCalls', 'emptyInputCalls', 'framesIn', 'zeroFrames', 'quantumGapCalls', 'quantumGapFrames']
  const delta = {}
  for (const key of keys) delta[key] = Math.max(0, (to[key] || 0) - (from[key] || 0))
  delta.currentFrameDelta = Math.max(0, (to.currentFrame || 0) - (from.currentFrame || 0))
  delta.currentTimeDeltaSec = Math.max(0, (to.currentTimeSec || 0) - (from.currentTimeSec || 0))
  const rate = to.sampleRate || 48000
  const quantum = to.quantumSize || 128
  delta.emptyInputMs = Math.round((delta.emptyInputCalls * quantum / rate) * 1000)
  delta.zeroInputMs = Math.round((delta.zeroFrames / rate) * 1000)
  delta.quantumGapMs = Math.round((delta.quantumGapFrames / rate) * 1000)
  delta.framesInMs = Math.round((delta.framesIn / rate) * 1000)
  return delta
}

function shouldLogRepeatedWarn(count) {
  return count <= REPEAT_WARN_HEAD || count % REPEAT_WARN_EVERY === 0
}

function handleWorkletStats(data) {
  const snapshot = makeWorkletSnapshot(data)
  workletStatsUpdates++
  lastWorkletStatsPerf = performance.now()
  if (!workletStatsBaseline) workletStatsBaseline = snapshot
  const prev = workletStatsPrev
  workletStatsPrev = snapshot
  workletStatsLatest = snapshot
  if (!prev || state !== 'recording') return
  const delta = diffWorkletStats(prev, snapshot)
  if (delta.emptyInputCalls > 0) {
    workletEmptyInputWarns++
    if (shouldLogRepeatedWarn(workletEmptyInputWarns)) {
      addLog('warn', 'audio.worklet.empty-input', {
        note: 'process() 被调用但 inputs[0] 无数据帧：MediaStream 源头没有交付音频（设备/驱动/浏览器采集侧）',
        deltaSinceLastStats: delta,
        occurrence: workletEmptyInputWarns,
      })
    }
  }
  if (delta.quantumGapFrames > 0) {
    workletQuantumGapWarns++
    if (shouldLogRepeatedWarn(workletQuantumGapWarns)) {
      addLog('warn', 'audio.worklet.quantum-gap', {
        note: '相邻 process() 之间 currentFrame 跳变：渲染量子被跳过',
        deltaSinceLastStats: delta,
        occurrence: workletQuantumGapWarns,
      })
    }
  }
}

// MediaStreamTrack.stats（MediaStreamTrackAudioStats）快照，特性检测，不支持时返回 null
function trackStatsSnapshot(track) {
  try {
    const stats = track?.stats
    if (!stats) return null
    let raw = null
    if (typeof stats.toJSON === 'function') {
      raw = stats.toJSON()
    } else {
      raw = {
        deliveredFrames: stats.deliveredFrames,
        deliveredFramesDuration: stats.deliveredFramesDuration,
        totalFrames: stats.totalFrames,
        totalFramesDuration: stats.totalFramesDuration,
        droppedFrames: stats.droppedFrames,
        droppedFramesDuration: stats.droppedFramesDuration,
        latency: stats.latency,
        averageLatency: stats.averageLatency,
        minimumLatency: stats.minimumLatency,
        maximumLatency: stats.maximumLatency,
      }
    }
    return { ...normalizeValue(raw), atPerfMs: Math.round(performance.now()) }
  } catch {
    return null
  }
}

// track.stats 前后差值；duration 字段规范单位为毫秒（DOMHighResTimeStamp）
function diffTrackStats(from, to) {
  if (!from || !to) return null
  const num = value => (typeof value === 'number' && Number.isFinite(value) ? value : 0)
  return {
    deliveredFrames: num(to.deliveredFrames) - num(from.deliveredFrames),
    totalFrames: num(to.totalFrames) - num(from.totalFrames),
    droppedFrames: num(to.droppedFrames) - num(from.droppedFrames),
    deliveredFramesDurationMs: num(to.deliveredFramesDuration) - num(from.deliveredFramesDuration),
    totalFramesDurationMs: num(to.totalFramesDuration) - num(from.totalFramesDuration),
    droppedFramesDurationMs: num(to.droppedFramesDuration) - num(from.droppedFramesDuration),
    wallSpanMs: num(to.atPerfMs) - num(from.atPerfMs),
  }
}

function attachRenderCapacity(context) {
  const capacity = context?.renderCapacity
  if (!capacity || typeof capacity.addEventListener !== 'function') {
    addLog('info', 'audio.render-capacity.unsupported')
    return
  }
  renderCapacitySupported = true
  const capacityHandler = event => {
    renderCapacityUpdates++
    renderCapacityLatest = {
      averageLoad: event.averageLoad,
      peakLoad: event.peakLoad,
      underrunRatio: event.underrunRatio,
      atPerfMs: Math.round(performance.now()),
    }
    if (event.underrunRatio > 0) {
      renderCapacityUnderrunEvents++
      renderCapacityMaxUnderrun = Math.max(renderCapacityMaxUnderrun, event.underrunRatio)
      if (shouldLogRepeatedWarn(renderCapacityUnderrunEvents)) {
        addLog('warn', 'audio.render.underrun', {
          note: '渲染线程出现欠载：音频渲染没有跟上实时（输出设备/系统音频服务/CPU 压力）',
          ...renderCapacityLatest,
          occurrence: renderCapacityUnderrunEvents,
        })
      }
    }
  }
  try {
    capacity.start?.({ updateInterval: 1 })
  } catch {}
  capacity.addEventListener('update', capacityHandler)
  removeHealthListeners.push(() => {
    capacity.removeEventListener('update', capacityHandler)
    try {
      capacity.stop?.()
    } catch {}
  })
  addLog('info', 'audio.render-capacity.ready')
}

function attachRawPortTraffic(instance) {
  const node = instance?._AUDIO?.node?.processorNode
  inputTransport = instance?._AUDIO?.node?.useWorklet ? 'audio-worklet' : 'script-processor'
  if (!instance?._AUDIO?.node?.useWorklet || !node?.port?.addEventListener) {
    addLog('warn', 'audio.transport.fallback', { inputTransport })
    return
  }
  const portHandler = event => {
    const command = event.data?.command
    if (command === 'workletStats') {
      handleWorkletStats(event.data)
      return
    }
    if (command !== 'audioData') return
    const length = Number(event.data.length || (event.data.buffer?.byteLength || 0) / Float32Array.BYTES_PER_ELEMENT)
    rawWorkletBufferCount++
    rawWorkletSamples += length
  }
  node.port.addEventListener('message', portHandler)
  node.port.start?.()
  removeHealthListeners.push(() => node.port.removeEventListener('message', portHandler))
  addLog('info', 'audio.transport.ready', { inputTransport })
}

function attachRecorderEvents(instance) {
  instance.on('error', error => addLog('error', 'recorder.error', error))
  instance.on('audioProcess', payload => {
    const now = performance.now()
    inputBufferCount++
    const inputLength = payload?.inputBuffer?.length || 0
    const contextRate = instance?._AUDIO?.context?.sampleRate || SAMPLE_RATE
    const expectedMs = inputLength ? (inputLength / contextRate) * 1000 : 0
    acceptedInputSamples += inputLength
    acceptedInputDurationMs += expectedMs
    expectedOutputSamples += inputLength * (SAMPLE_RATE / contextRate)
    if (lastInputPerf && state === 'recording') {
      const gapMs = now - lastInputPerf
      const playbackGapMs = lastInputPlaybackTime ? (payload.playbackTime - lastInputPlaybackTime) * 1000 : 0
      if (gapMs > Math.max(CALLBACK_GAP_WARN_MS, expectedMs * 2.5)) {
        addLog('warn', 'audio.input.callback-gap', {
          gapMs: Math.round(gapMs),
          expectedMs: Math.round(expectedMs),
          playbackGapMs: Math.round(playbackGapMs),
          inputLength,
          contextState: instance?._AUDIO?.context?.state,
        })
      }
    }
    lastInputPerf = now
    lastInputPlaybackTime = payload?.playbackTime || 0
  })
  instance.on('audioProcessPcmData', payload => {
    const now = performance.now()
    const length = Number(payload?.length || 0)
    capturedSamples += length
    pcmBufferCount++
    lastPcmPerf = now
    const samples = getPcmArray(payload)
    if (samples) appendWaveform(samples, length)
  })
}

function attachHealthListeners(instance) {
  const context = instance?._AUDIO?.context
  const stream = instance?._AUDIO?.stream
  const track = stream?.getAudioTracks?.()[0]
  if (!context || !track) {
    addLog('error', 'health.attach.failed', { hasContext: !!context, hasTrack: !!track })
    return
  }

  trackSnapshot = snapshotTrack(track)
  addLog('info', 'audio.track.ready', trackSnapshot)
  addLog('info', 'audio.context.ready', { state: context.state, sampleRate: context.sampleRate, baseLatency: context.baseLatency, outputLatency: context.outputLatency })

  attachRenderCapacity(context)
  trackStatsSupported = !!track.stats
  trackStatsBaseline = trackStatsSnapshot(track)
  addLog('info', trackStatsSupported ? 'audio.track-stats.ready' : 'audio.track-stats.unsupported', { baseline: trackStatsBaseline })

  for (const eventName of ['mute', 'unmute', 'ended']) {
    const handler = () => addLog(eventName === 'unmute' ? 'info' : 'warn', `audio.track.${eventName}`, {
      enabled: track.enabled,
      muted: track.muted,
      readyState: track.readyState,
      settings: track.getSettings?.(),
    })
    track.addEventListener(eventName, handler)
    removeHealthListeners.push(() => track.removeEventListener(eventName, handler))
  }

  const contextHandler = () => addLog(context.state === 'running' ? 'info' : 'warn', 'audio.context.statechange', {
    state: context.state,
    currentTime: context.currentTime,
    clocks: clockSnapshot(),
  })
  context.addEventListener('statechange', contextHandler)
  removeHealthListeners.push(() => context.removeEventListener('statechange', contextHandler))
}

function snapshotTrack(track) {
  if (!track) return null
  return {
    label: track.label,
    id: track.id,
    enabled: track.enabled,
    muted: track.muted,
    readyState: track.readyState,
    settings: normalizeValue(track.getSettings?.() || {}),
    constraints: normalizeValue(track.getConstraints?.() || {}),
    capabilities: normalizeValue(track.getCapabilities?.() || {}),
  }
}

async function startRecording() {
  if (!window.isSecureContext) {
    addLog('error', 'record.start.blocked', { reason: 'not-secure-context', origin: location.origin })
    alert('麦克风要求 HTTPS 或 localhost 安全环境，请通过 GitHub Pages 地址或 start-demo.cmd 打开。')
    return
  }

  clearSessionData()
  activeConfig = getConfig()
  setState('stopping', '正在启动')
  addLog('info', 'session.start.requested', { sessionId, config: activeConfig, userAgent: navigator.userAgent })

  try {
    sharedMediaStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints(activeConfig) })
    addLog('info', 'shared-stream.ready', { track: snapshotTrack(sharedMediaStream.getAudioTracks()[0]) })
    prepareReferenceRecorder(sharedMediaStream)
    recorder = new IVRecorder({
      useVAD: false,
      useVVD: true,
      enablePeaks: true,
      peaksPerSecond: 100,
      enableAGC: activeConfig.enableAGC,
      echoCancellation: activeConfig.echoCancellation,
      noiseSuppression: activeConfig.noiseSuppression,
      deviceId: activeConfig.deviceId,
      mediaStream: sharedMediaStream,
    })
    instrumentRecorderInternals(recorder)
    attachRecorderEvents(recorder)
    await recorder.start()
    recorder.pause()
    await recorder.reset()
    const context = recorder?._AUDIO?.context
    contextBaselineSec = context?.currentTime ?? null
    acceptedInputDurationBaselineMs = acceptedInputDurationMs
    expectedOutputSamplesBaseline = expectedOutputSamples
    capturedSamplesBaseline = capturedSamples
    attachRawPortTraffic(recorder)
    attachHealthListeners(recorder)
    sessionStartPerf = performance.now()
    setState('recording', '录音中')
    recorder.resume()
    startReferenceRecording()
    startHeartbeat()
    void requestScreenWakeLock('recording-start')
    await refreshDevices(false)
    addLog('info', 'session.started', {
      sessionId,
      contextBaselineSec,
      acceptedInputDurationBaselineMs,
      capturedSamplesBaseline,
      inputTransport,
      referenceMimeType: referenceRecorder?.mimeType || null,
      clocks: clockSnapshot(),
    })
  } catch (error) {
    setState('idle', '启动失败')
    addLog('error', 'session.start.failed', error)
    alert(`录音启动失败：${error?.message || error}`)
    try {
      await stopReferenceRecording()
    } catch {}
    try {
      await recorder?.destroy?.()
    } catch {}
    sharedMediaStream?.getTracks().forEach(track => track.stop())
    sharedMediaStream = null
    await releaseScreenWakeLock('start-failed')
    recorder = null
  }
}

function pauseRecording(reason = 'user') {
  if (!recorder) return
  if (state !== 'recording') return
  const now = performance.now()
  const context = recorder?._AUDIO?.context
  recorder.pause()
  pauseReferenceRecording()
  pauseStartPerf = now
  contextPauseStartSec = context?.currentTime ?? null
  currentPause = {
    index: pauses.length + 1,
    reason,
    startedAt: new Date().toISOString(),
    startPerfMs: Math.round(now),
    startClocks: clockSnapshot(),
    rawPausedSamplesStart: rawPausedSamples,
  }
  setState('paused', reason === 'visibility-hidden' ? '切后台暂停' : '已暂停')
  addLog('warn', 'session.paused', currentPause)
}

function resumeRecording(reason = 'user') {
  if (!recorder || state !== 'paused') return
  const now = performance.now()
  const contextNow = recorder?._AUDIO?.context?.currentTime ?? null
  const duration = now - pauseStartPerf
  pausedTotalMs += duration
  if (contextPauseStartSec != null && contextNow != null) {
    contextPausedTotalSec += Math.max(0, contextNow - contextPauseStartSec)
  }
  const completedPause = {
    ...(currentPause || { index: pauses.length + 1, reason: 'unknown' }),
    endedAt: new Date().toISOString(),
    endPerfMs: Math.round(now),
    durationMs: Math.round(duration),
    rawSamplesDuringPause: rawPausedSamples - (currentPause?.rawPausedSamplesStart || 0),
    resumedBy: reason,
  }
  pauses.push(completedPause)
  currentPause = null
  pauseStartPerf = 0
  contextPauseStartSec = null
  setState('recording', '录音中')
  recorder.resume()
  resumeReferenceRecording()
  lastInputPerf = 0
  lastRawIngressPerf = 0
  addLog('info', 'session.resumed', {
    ...completedPause,
    pausedTotalMs: Math.round(pausedTotalMs),
    clocks: clockSnapshot(),
  })
}

function pauseOrResume() {
  if (state === 'recording') pauseRecording('user')
  else if (state === 'paused') resumeRecording('user')
}

function chainCounters() {
  return {
    rawIngressSamples,
    rawIngressBufferCount,
    rawWorkletSamples,
    rawWorkletBufferCount,
    acceptedInputSamples,
    inputBufferCount,
    expectedOutputSamples: Math.round(expectedOutputSamples),
    capturedSamples,
    pcmBufferCount,
    workerCompletedCount,
    pendingWorkerTasks: recorder?._pendingWorkerTasks ?? null,
  }
}

function readFourCC(view, offset) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  )
}

function isActiveEnvelopeBin(bin) {
  return bin.rmsDbFS != null && bin.rmsDbFS >= ACTIVE_RMS_DB
}

function hasNearbyActive(envelope, index, direction) {
  for (let distance = 1; distance <= 5; distance++) {
    const bin = envelope[index + distance * direction]
    if (!bin) return false
    if (isActiveEnvelopeBin(bin)) return true
  }
  return false
}

function findEnvelopeIntervals(envelope, predicate, reason, minimumMs) {
  const intervals = []
  let start = -1
  const close = endExclusive => {
    if (start < 0) return
    const first = envelope[start]
    const last = envelope[endExclusive - 1]
    const durationMs = last.endMs - first.startMs
    if (
      durationMs >= minimumMs &&
      hasNearbyActive(envelope, start, -1) &&
      hasNearbyActive(envelope, endExclusive - 1, 1)
    ) {
      const bins = envelope.slice(start, endExclusive)
      intervals.push({
        reason,
        startMs: first.startMs,
        endMs: last.endMs,
        durationMs,
        averageExactZeroPct: Number((bins.reduce((sum, bin) => sum + bin.exactZeroPct, 0) / bins.length).toFixed(2)),
        lowestRmsDbFS: bins.some(bin => bin.rmsDbFS == null) ? null : Math.min(...bins.map(bin => bin.rmsDbFS)),
      })
    }
    start = -1
  }

  for (let i = 0; i < envelope.length; i++) {
    if (predicate(envelope[i])) {
      if (start < 0) start = i
    } else {
      close(i)
    }
  }
  close(envelope.length)
  return intervals
}

function analyzeEnvelopeIntervals(envelope) {
  const nearSilenceHoles = findEnvelopeIntervals(
    envelope,
    bin => bin.rmsDbFS == null || bin.rmsDbFS <= SILENCE_RMS_DB,
    'near-silence-between-active-audio',
    200
  )
  const digitalZeroBursts = findEnvelopeIntervals(
    envelope,
    bin => bin.exactZeroPct >= 25,
    'high-exact-zero-ratio-between-active-audio',
    100
  )
  return {
    thresholds: {
      envelopeMs: ENVELOPE_MS,
      nearSilenceRmsDbFS: SILENCE_RMS_DB,
      surroundingActiveRmsDbFS: ACTIVE_RMS_DB,
      digitalZeroPct: 25,
    },
    nearSilenceHoles,
    digitalZeroBursts,
    suspiciousIntervals: [...nearSilenceHoles, ...digitalZeroBursts].sort((a, b) => a.startMs - b.startMs),
  }
}

async function analyzeWavFile(file) {
  const buffer = await file.arrayBuffer()
  const view = new DataView(buffer)
  if (view.byteLength < 44 || readFourCC(view, 0) !== 'RIFF' || readFourCC(view, 8) !== 'WAVE') {
    throw new Error('导出的文件不是有效 RIFF/WAVE')
  }

  let format = null
  let dataOffset = -1
  let dataBytes = 0
  let offset = 12
  while (offset + 8 <= view.byteLength) {
    const chunkId = readFourCC(view, offset)
    const chunkBytes = view.getUint32(offset + 4, true)
    const payloadOffset = offset + 8
    if (chunkId === 'fmt ' && chunkBytes >= 16) {
      format = {
        audioFormat: view.getUint16(payloadOffset, true),
        channels: view.getUint16(payloadOffset + 2, true),
        sampleRate: view.getUint32(payloadOffset + 4, true),
        byteRate: view.getUint32(payloadOffset + 8, true),
        blockAlign: view.getUint16(payloadOffset + 12, true),
        bitDepth: view.getUint16(payloadOffset + 14, true),
      }
    } else if (chunkId === 'data') {
      dataOffset = payloadOffset
      dataBytes = Math.min(chunkBytes, view.byteLength - payloadOffset)
      break
    }
    offset = payloadOffset + chunkBytes + (chunkBytes % 2)
  }

  if (!format || dataOffset < 0 || format.audioFormat !== 1 || format.bitDepth !== 16) {
    throw new Error('仅支持分析 16-bit PCM WAV')
  }

  const frameCount = Math.floor(dataBytes / format.blockAlign)
  const envelope = []
  const envelopeAccumulator = createEnvelopeAccumulator(format.sampleRate, envelope)
  let sumSquares = 0
  let peak = 0
  let exactZeros = 0
  let clipping = 0
  let zeroRunStart = -1
  const zeroRuns = []

  const closeZeroRun = endFrame => {
    if (zeroRunStart < 0) return
    const samples = endFrame - zeroRunStart
    const durationMs = (samples / format.sampleRate) * 1000
    if (durationMs >= ZERO_RUN_MIN_MS) {
      zeroRuns.push({
        startMs: Math.round((zeroRunStart / format.sampleRate) * 1000),
        endMs: Math.round((endFrame / format.sampleRate) * 1000),
        durationMs: Number(durationMs.toFixed(3)),
        samples,
      })
    }
    zeroRunStart = -1
  }

  for (let frame = 0; frame < frameCount; frame++) {
    const sample = view.getInt16(dataOffset + frame * format.blockAlign, true)
    const normalized = sample / 32768
    const abs = Math.abs(normalized)
    sumSquares += normalized * normalized
    if (abs > peak) peak = abs
    if (sample === 0) {
      exactZeros++
      if (zeroRunStart < 0) zeroRunStart = frame
    } else {
      closeZeroRun(frame)
    }
    if (Math.abs(sample) >= 32760) clipping++
    appendEnvelopeValue(envelopeAccumulator, sample, 32768)
  }
  closeZeroRun(frameCount)
  commitEnvelopeBin(envelopeAccumulator)

  const rms = frameCount ? Math.sqrt(sumSquares / frameCount) : 0
  const intervalAnalysis = analyzeEnvelopeIntervals(envelope)
  return {
    container: 'RIFF/WAVE',
    ...format,
    fileBytes: file.size,
    dataBytes,
    frameCount,
    durationSec: frameCount / format.sampleRate,
    rmsDbFS: rms > 0 ? Number((20 * Math.log10(rms)).toFixed(2)) : null,
    peakDbFS: peak > 0 ? Number((20 * Math.log10(peak)).toFixed(2)) : null,
    exactZeroSamples: exactZeros,
    exactZeroPct: frameCount ? Number(((exactZeros / frameCount) * 100).toFixed(4)) : 0,
    clippingSamples: clipping,
    clippingPct: frameCount ? Number(((clipping / frameCount) * 100).toFixed(4)) : 0,
    longestZeroRuns: zeroRuns.sort((a, b) => b.durationMs - a.durationMs).slice(0, 50),
    envelope,
    ...intervalAnalysis,
  }
}

function exportAndAnalyzePeaks(instance) {
  const binary = instance.exportPeaksBinary()
  const parsed = IVRecorder.parsePeaksBinary(binary)
  let maxAbsPeak = 0
  let exactZeroPairs = 0
  for (const [min, max] of parsed.peaks) {
    maxAbsPeak = Math.max(maxAbsPeak, Math.abs(min), Math.abs(max))
    if (min === 0 && max === 0) exactZeroPairs++
  }
  return {
    byteLength: binary.byteLength,
    version: new DataView(binary).getUint32(0, true),
    length: parsed.length,
    durationSec: parsed.duration,
    peaksPerSecond: parsed.peaksPerSecond,
    sampleRate: parsed.sampleRate,
    maxAbsPeak: Number(maxAbsPeak.toFixed(6)),
    exactZeroPairs,
    exactZeroPairPct: parsed.length ? Number(((exactZeroPairs / parsed.length) * 100).toFixed(3)) : 0,
  }
}

function deriveDiagnosis() {
  const clocks = clockSnapshot()
  const { projectMs, contextMs, acceptedInputMs, outputPcmMs, driftsMs } = clocks
  const rawMs = rawActiveDurationMs
  // Short recordings have startup/Worklet quantum jitter; incident-scale gaps are much larger.
  const thresholdMs = Math.max(1500, projectMs * 0.01)
  const continuityIntervals = wavAnalysis?.suspiciousIntervals || []
  const rawIntervalAnalysis = analyzeEnvelopeIntervals(rawInputEnvelope)
  const rawIntervals = rawIntervalAnalysis.suspiciousIntervals
  const upstreamDigitalZeroEvidence =
    (wavAnalysis?.digitalZeroBursts?.length || 0) > 0 &&
    rawIntervalAnalysis.digitalZeroBursts.length > 0
  const workletDelta = diffWorkletStats(workletStatsBaseline, workletStatsLatest)
  const trackStatsDelta = diffTrackStats(trackStatsBaseline, trackStatsFinal || trackStatsSnapshot(recorder?._AUDIO?.stream?.getAudioTracks?.()[0]))
  const referenceDurationMs = referenceSnapshot?.mediaDurationSec ? referenceSnapshot.mediaDurationSec * 1000 : null
  const evidence = {
    thresholdMs: Math.round(thresholdMs),
    clocks,
    rawActiveMs: Math.round(rawMs),
    rawMinusAcceptedMs: Math.round(rawMs - acceptedInputMs),
    contextMinusRawMs: Math.round(contextMs - rawMs),
    workerQueuedCount: inputBufferCount,
    workerCompletedCount,
    pendingWorkerTasks: recorder?._pendingWorkerTasks ?? null,
    wavSuspiciousIntervalCount: continuityIntervals.length,
    rawSuspiciousIntervalCount: rawIntervals.length,
    reference: {
      ...referenceSnapshot,
      durationMs: referenceDurationMs == null ? null : Math.round(referenceDurationMs),
      referenceMinusOutputMs: referenceDurationMs == null ? null : Math.round(referenceDurationMs - outputPcmMs),
    },
    workletStats: {
      supported: inputTransport === 'audio-worklet' && workletStatsUpdates > 0,
      updates: workletStatsUpdates,
      baseline: workletStatsBaseline,
      latest: workletStatsLatest,
      delta: workletDelta,
    },
    renderCapacity: {
      supported: renderCapacitySupported,
      updates: renderCapacityUpdates,
      underrunEvents: renderCapacityUnderrunEvents,
      maxUnderrunRatio: renderCapacityMaxUnderrun,
      latest: renderCapacityLatest,
    },
    trackStats: {
      supported: trackStatsSupported,
      baseline: trackStatsBaseline,
      final: trackStatsFinal,
      delta: trackStatsDelta,
    },
  }

  const unfinishedPause = [...pauses].reverse().find(pause => pause.endedBy === 'stop')
  if (
    unfinishedPause &&
    Math.abs(driftsMs.projectMinusOutput - unfinishedPause.durationMs) <= 1500
  ) {
    return {
      code: 'recording-ended-while-paused',
      severity: 'warning',
      title: '录制在暂停状态下结束',
      detail: `最后一次暂停约 ${(unfinishedPause.durationMs / 1000).toFixed(3)} 秒，现网项目时间不会扣除这段尚未 resume 的暂停，而音频停止采集；它可以解释本次大部分时长差。`,
      evidence: { ...evidence, unfinishedPause },
    }
  }

  if (referenceDurationMs != null && referenceDurationMs - outputPcmMs > thresholdMs) {
    return {
      code: 'iv-recorder-vs-media-recorder-divergence',
      severity: 'danger',
      title: '原生录音完整，IVRecorder 音频明显变短',
      detail: `同一麦克风流中，浏览器原生录音比 IVRecorder 多 ${(referenceDurationMs - outputPcmMs).toFixed(0)} ms。问题位于 MediaStream 之后的 AudioContext、AudioWorklet、主线程消息或 Worker 重采样链路，可结合四层计数继续定位。`,
      evidence,
    }
  }

  if (Math.abs(driftsMs.projectMinusOutput) <= thresholdMs) {
    if (upstreamDigitalZeroEvidence) {
      return {
        code: 'upstream-input-intermittency',
        severity: 'warning',
        title: '时长基本一致，输入信号已出现断续',
        detail: 'Worklet 输入和最终 WAV 都存在被有效声音包围的低电平/数字零区间。问题位于 SDK 重采样之前，但仅凭网页无法再区分麦克风驱动、系统音频增强与浏览器 AEC。',
        evidence,
      }
    }
    return {
      code: 'clocks-aligned',
      severity: 'ok',
      title: '本次四条时钟基本一致',
      detail: continuityIntervals.length
        ? '最终 WAV 检出可疑静音区间，但本次没有出现明显时长丢失；需结合标记点和包络复核。'
        : '本次未复现明显时长丢失或链路级停顿。',
      evidence,
    }
  }

  if (driftsMs.projectMinusContext > thresholdMs) {
    // 细分：渲染欠载（输出设备/系统音频侧） vs 页面冻结/suspend
    let detail = '优先检查页面冻结、AudioContext suspend、浏览器节能策略或系统音频服务中断。'
    if (renderCapacitySupported && renderCapacityUnderrunEvents > 0) {
      detail = `renderCapacity 观察到 ${renderCapacityUnderrunEvents} 次欠载（峰值 underrunRatio=${renderCapacityMaxUnderrun.toFixed(3)}）：渲染线程实际停摆/欠载。录音 Worklet 由输出设备时钟驱动，重点排查扬声器/耳机（蓝牙断连、HDMI 显示器音频休眠、USB 选择性暂停、驱动异常）与系统音频服务。`
    } else if (renderCapacitySupported && renderCapacityUpdates > 0) {
      detail = 'renderCapacity 未报欠载，但 AudioContext 时钟落后于墙钟：优先检查页面冻结、context suspend/interrupted 事件与系统电源策略；对照 heartbeats 里 contextTimeSec 的停走区间。'
    }
    return {
      code: 'audio-context-clock-stalled',
      severity: 'danger',
      title: 'AudioContext 时钟未跟上项目时间',
      detail,
      evidence,
    }
  }
  if (contextMs - rawMs > thresholdMs) {
    // 细分：worklet 层面区分「输入为空」（源无帧）与「量子跳变/端口丢失」
    let detail = '问题更靠近 MediaStream、麦克风设备/驱动或浏览器音频图；不是 WAV 导出阶段造成。'
    const gapMs = contextMs - rawMs
    if (workletDelta) {
      const emptyMs = workletDelta.emptyInputMs || 0
      const quantumGapMs = workletDelta.quantumGapMs || 0
      if (emptyMs >= gapMs * 0.6) {
        detail = `Worklet process() 正常运行但 inputs[0] 无数据帧共约 ${(emptyMs / 1000).toFixed(1)} 秒（覆盖本次缺口的大部分）：MediaStream 源头没有交付音频，指向麦克风设备/驱动或浏览器采集进程。${trackStatsDelta ? `track.stats 交付帧时长 ${(trackStatsDelta.deliveredFramesDurationMs / 1000).toFixed(1)} 秒 vs 总帧时长 ${(trackStatsDelta.totalFramesDurationMs / 1000).toFixed(1)} 秒，可进一步区分驱动层与浏览器层。` : ''}`
      } else if (quantumGapMs >= gapMs * 0.6) {
        detail = `Worklet 观察到渲染量子跳变共约 ${(quantumGapMs / 1000).toFixed(1)} 秒：音频渲染图本身丢量子，优先排查渲染线程压力与浏览器音频进程。`
      } else if (emptyMs + quantumGapMs < gapMs * 0.3) {
        detail = `Worklet 内部计数（空输入 ${(emptyMs / 1000).toFixed(1)}s + 量子跳变 ${(quantumGapMs / 1000).toFixed(1)}s）不能解释缺口 ${(gapMs / 1000).toFixed(1)}s：怀疑 worklet→主线程端口消息丢失或主线程长时间无法处理消息，结合 longTasks 与页面生命周期事件复核。`
      }
    }
    return {
      code: 'media-input-or-graph-stalled',
      severity: 'danger',
      title: 'AudioContext 在运行，但 Worklet 输入不足',
      detail,
      evidence,
    }
  }
  if (rawMs - acceptedInputMs > thresholdMs) {
    return {
      code: 'recorder-state-dropped-input',
      severity: 'danger',
      title: 'Worklet 有输入，但录音器未接收',
      detail: '优先检查 pause/resume 状态错位、隐藏页自动暂停或 SDK recording/paused 状态异常。',
      evidence,
    }
  }
  if (acceptedInputMs - outputPcmMs > thresholdMs) {
    return {
      code: 'worker-resampler-output-loss',
      severity: 'danger',
      title: 'Worker 接收了输入，但 32 kHz PCM 输出不足',
      detail: '问题集中在 Worker 调度、重采样、任务完成或缓冲收尾阶段。',
      evidence,
    }
  }
  return {
    code: 'project-pause-accounting-divergence',
    severity: 'warning',
    title: '音频链路内部一致，项目时间仍有差异',
    detail: '优先检查视频时间轴、暂停累计和结束时仍处于暂停状态的计时口径。',
    evidence,
  }
}

async function stopRecording() {
  if (!recorder || (state !== 'recording' && state !== 'paused')) return
  const wasPaused = state === 'paused'
  const stopRequestedPerf = performance.now()
  sessionEndPerf = stopRequestedPerf
  contextFinalSec = recorder?._AUDIO?.context?.currentTime ?? null

  if (state === 'paused') {
    finalOpenPauseMs = Math.max(0, stopRequestedPerf - pauseStartPerf)
    if (contextPauseStartSec != null && contextFinalSec != null) {
      contextPausedTotalSec += Math.max(0, contextFinalSec - contextPauseStartSec)
    }
    pauses.push({
      ...(currentPause || { index: pauses.length + 1, reason: 'unknown' }),
      endedAt: new Date().toISOString(),
      endPerfMs: Math.round(stopRequestedPerf),
      durationMs: Math.round(finalOpenPauseMs),
      rawSamplesDuringPause: rawPausedSamples - (currentPause?.rawPausedSamplesStart || 0),
      endedBy: 'stop',
      deductedFromProductionProjectClock: false,
    })
    currentPause = null
    pauseStartPerf = 0
    contextPauseStartSec = null
  }
  setState('stopping', '正在收尾')
  stopHeartbeat()
  createHeartbeat()
  addLog('info', 'session.stop.requested', {
    wasPaused,
    finalOpenPauseMs: Math.round(finalOpenPauseMs),
    clocks: clockSnapshot(),
    counters: chainCounters(),
  })

  try {
    const firstStopStarted = performance.now()
    const referenceStop = stopReferenceRecording().catch(error => {
      addLog('error', 'reference.stop.failed', error)
      return null
    })
    const firstStopResult = await recorder.stop()
    await referenceStop
    const firstStopStage = {
      stage: 'explicit-stop',
      startedPerfMs: Math.round(firstStopStarted),
      completedPerfMs: Math.round(performance.now()),
      durationMs: Math.round(performance.now() - firstStopStarted),
      result: firstStopResult,
      counters: chainCounters(),
    }
    stopSequence.push(firstStopStage)
    addLog('info', 'sdk.stop.first.completed', firstStopStage)

    const exportStarted = performance.now()
    addLog('info', 'sdk.export.started', {
      note: 'exportWAVFile 内部会再次调用 stop，与现网 genAudio 一致',
      counters: chainCounters(),
    })
    const exported = await recorder.exportWAVFile(`${sessionId}.wav`)
    const exportStage = {
      stage: 'export-wav-with-internal-second-stop',
      startedPerfMs: Math.round(exportStarted),
      completedPerfMs: Math.round(performance.now()),
      durationMs: Math.round(performance.now() - exportStarted),
      counters: chainCounters(),
    }
    stopSequence.push(exportStage)
    addLog('info', 'sdk.export.completed', exportStage)

    audioFile = exported.file
    audioUrl = URL.createObjectURL(audioFile)
    elements.audioPlayer.src = audioUrl
    elements.playbackMarkerBtn.disabled = false
    elements.downloadResultJsonBtn.disabled = false
    elements.downloadWavBtn.disabled = false
    await finalizeReferenceResult()
    flushEnvelopeAccumulators()

    try {
      peaksSnapshot = exportAndAnalyzePeaks(recorder)
      addLog('info', 'sdk.peaks.exported-and-parsed', peaksSnapshot)
    } catch (error) {
      addLog('warn', 'sdk.peaks.analysis.failed', error)
    }

    wavAnalysis = await analyzeWavFile(audioFile)
    const finalTrack = recorder?._AUDIO?.stream?.getAudioTracks?.()[0]
    finalTrackSnapshot = snapshotTrack(finalTrack)
    trackStatsFinal = trackStatsSnapshot(finalTrack)
    diagnosisSnapshot = deriveDiagnosis()
    const clocks = clockSnapshot()
    resultSnapshot = {
      filename: audioFile.name,
      bytes: audioFile.size,
      sdkDurationSec: exported.duration,
      wavDurationSec: wavAnalysis.durationSec,
      totalPcmDurationSec: capturedSamples / SAMPLE_RATE,
      sessionPcmDurationSec: sessionPcmMs() / 1000,
      projectDurationSec: projectClockMs() / 1000,
      effectiveActiveDurationSec: nowActiveMs() / 1000,
      projectMinusPcmMs: clocks.driftsMs.projectMinusOutput,
      capturedSamples,
      capturedSamplesBaseline,
      acceptedInputSamples,
      pcmBufferCount,
      inputBufferCount,
      workerCompletedCount,
      clocks,
      wav: {
        sampleRate: wavAnalysis.sampleRate,
        channels: wavAnalysis.channels,
        bitDepth: wavAnalysis.bitDepth,
        frameCount: wavAnalysis.frameCount,
        exactZeroPct: wavAnalysis.exactZeroPct,
        suspiciousIntervalCount: wavAnalysis.suspiciousIntervals.length,
      },
    }
    elements.resultSection.hidden = false
    const referenceDurationSec = referenceSnapshot?.mediaDurationSec || referenceSnapshot?.wallDurationSec || null
    const referenceMinusIvMs = referenceDurationSec == null ? null : Math.round((referenceDurationSec - wavAnalysis.durationSec) * 1000)
    elements.resultSummary.textContent = referenceMinusIvMs == null
      ? `IVRecorder ${wavAnalysis.durationSec.toFixed(3)} 秒 · 项目/PCM ${resultSnapshot.projectMinusPcmMs >= 0 ? '+' : ''}${resultSnapshot.projectMinusPcmMs} ms`
      : `原生 ${referenceDurationSec.toFixed(3)} 秒 · IVRecorder ${wavAnalysis.durationSec.toFixed(3)} 秒 · 原生/IV 差 ${referenceMinusIvMs >= 0 ? '+' : ''}${referenceMinusIvMs} ms`
    elements.ivResultSummary.textContent = `audio/wav · ${(audioFile.size / 1024 / 1024).toFixed(2)} MiB · ${wavAnalysis.durationSec.toFixed(3)} 秒 · 精确零值 ${wavAnalysis.exactZeroPct}%`
    elements.diagnosisBox.hidden = false
    elements.diagnosisBox.className = `diagnosis-box ${diagnosisSnapshot.severity === 'ok' ? '' : diagnosisSnapshot.severity}`.trim()
    elements.diagnosisTitle.textContent = diagnosisSnapshot.title
    elements.diagnosisText.textContent = diagnosisSnapshot.detail
    addLog(diagnosisSnapshot.severity === 'danger' ? 'error' : diagnosisSnapshot.severity === 'warning' ? 'warn' : 'info', 'diagnosis.completed', diagnosisSnapshot)
    addLog(Math.abs(resultSnapshot.projectMinusPcmMs) > DRIFT_WARN_MS ? 'warn' : 'info', 'session.exported', resultSnapshot)
    elements.sharePackageBtn.disabled = !(referenceFile && audioFile)
    elements.downloadPackageBtn.disabled = !(referenceFile && audioFile)
    setState('done', '已完成')
  } catch (error) {
    setState('idle', '导出失败')
    addLog('error', 'session.export.failed', error)
    alert(`录音导出失败：${error?.message || error}`)
  } finally {
    try {
      await recorder.destroy()
    } catch (error) {
      addLog('warn', 'recorder.destroy.failed', error)
    }
    sharedMediaStream?.getTracks().forEach(track => track.stop())
    sharedMediaStream = null
    referenceRecorder = null
    await releaseScreenWakeLock('recording-stopped')
    recorder = null
    updateMetrics()
    await refreshDevices(false)
  }
}

function addMarker() {
  const clocks = clockSnapshot()
  const marker = {
    index: markers.length + 1,
    source: 'recording-live',
    timestamp: new Date().toISOString(),
    clocks,
    contextState: recorder?._AUDIO?.context?.state || 'unknown',
    trackMuted: recorder?._AUDIO?.stream?.getAudioTracks?.()[0]?.muted,
    counters: chainCounters(),
    levelDbFS: Number.isFinite(latestLevelDb) ? Number(latestLevelDb.toFixed(2)) : null,
  }
  markers.push(marker)
  diagnosticPackageFile = null
  addLog('warn', 'user.glitch-marker', marker)
  queueWaveformRender()
}

function addPlaybackMarker(source = 'iv-recorder') {
  const isReference = source === 'media-recorder-reference'
  const file = isReference ? referenceFile : audioFile
  const player = isReference ? elements.referenceAudioPlayer : elements.audioPlayer
  if (!file || !Number.isFinite(player.currentTime)) return
  const playbackMs = Math.max(0, Math.round(player.currentTime * 1000))
  const marker = {
    index: markers.length + 1,
    source,
    timestamp: new Date().toISOString(),
    playbackMs,
    clocks: isReference ? { referenceMs: playbackMs } : { outputPcmMs: playbackMs },
  }
  markers.push(marker)
  diagnosticPackageFile = null
  addLog('warn', 'user.playback-marker', marker)
  queueWaveformRender()
}

function performanceMemorySnapshot() {
  const memory = performance.memory
  if (!memory) return null
  return {
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    totalJSHeapSize: memory.totalJSHeapSize,
    usedJSHeapSize: memory.usedJSHeapSize,
  }
}

function createHeartbeat() {
  const context = recorder?._AUDIO?.context
  const track = recorder?._AUDIO?.stream?.getAudioTracks?.()[0]
  const clocks = clockSnapshot()
  const drift = clocks.driftsMs.projectMinusOutput
  latestDriftMs = drift
  const heartbeat = {
    timestamp: new Date().toISOString(),
    state,
    clocks,
    contextState: context?.state || 'missing',
    contextTimeSec: context?.currentTime ?? null,
    contextSampleRate: context?.sampleRate ?? null,
    trackMuted: track?.muted ?? null,
    trackEnabled: track?.enabled ?? null,
    trackReadyState: track?.readyState ?? null,
    trackStats: trackStatsSnapshot(track),
    contextOutputLatencySec: context?.outputLatency ?? null,
    contextBaseLatencySec: context?.baseLatency ?? null,
    contextSinkId: typeof context?.sinkId === 'string' ? context.sinkId : context?.sinkId ? 'audio-sink-object' : null,
    renderCapacity: renderCapacityLatest,
    workletStats: workletStatsLatest,
    workletStatsAgeMs: lastWorkletStatsPerf ? Math.round(performance.now() - lastWorkletStatsPerf) : null,
    pendingWorkerTasks: recorder?._pendingWorkerTasks ?? null,
    inputTransport,
    referenceRecorder: {
      state: referenceRecorder?.state || 'missing',
      chunkCount: referenceChunks.length,
      bytes: referenceChunks.reduce((total, chunk) => total + chunk.size, 0),
      mimeType: referenceRecorder?.mimeType || null,
    },
    wakeLockHeld: !!wakeLock,
    rawIngressSamples,
    rawActiveSamples,
    rawPausedSamples,
    rawWorkletSamples,
    acceptedInputSamples,
    expectedOutputSamples: Math.round(expectedOutputSamples),
    capturedSamples,
    workerCompletedCount,
    inputBufferCount,
    pcmBufferCount,
    rawWorkletBufferCount,
    rawIngressBufferCount,
    lastRawIngressAgeMs: lastRawIngressPerf ? Math.round(performance.now() - lastRawIngressPerf) : null,
    lastInputAgeMs: lastInputPerf ? Math.round(performance.now() - lastInputPerf) : null,
    lastPcmAgeMs: lastPcmPerf ? Math.round(performance.now() - lastPcmPerf) : null,
    lastWorkerCompleteAgeMs: lastWorkerCompletePerf ? Math.round(performance.now() - lastWorkerCompletePerf) : null,
    levelDbFS: Number.isFinite(latestLevelDb) ? Number(latestLevelDb.toFixed(2)) : null,
    visibilityState: document.visibilityState,
    memory: performanceMemorySnapshot(),
  }
  heartbeats.push(heartbeat)
  if (heartbeats.length > 7200) heartbeats.shift()
  heartbeatCount++

  // worklet 每 ~1s 应上报一次 stats；长时间没有上报且录音进行中 = 渲染线程停摆（比 currentTime 观察更直接）
  if (
    state === 'recording' &&
    inputTransport === 'audio-worklet' &&
    lastWorkletStatsPerf &&
    performance.now() - lastWorkletStatsPerf > WORKLET_STATS_STALL_WARN_MS &&
    performance.now() - lastWorkletStallWarnPerf > WORKLET_STATS_STALL_WARN_MS
  ) {
    lastWorkletStallWarnPerf = performance.now()
    addLog('error', 'audio.worklet.stats-stalled', {
      note: '音频线程超过阈值未上报 workletStats：渲染线程停摆（输出设备休眠/系统音频服务中断）',
      workletStatsAgeMs: Math.round(performance.now() - lastWorkletStatsPerf),
      contextState: recorder?._AUDIO?.context?.state,
      contextTimeSec: recorder?._AUDIO?.context?.currentTime ?? null,
      renderCapacity: renderCapacityLatest,
    })
  }

  const driftGrowth = Math.abs(drift - lastWarnedDriftMs)
  if (state === 'recording' && Math.abs(drift) > DRIFT_WARN_MS && driftGrowth > 250) {
    addLog(Math.abs(drift) > DRIFT_ERROR_MS ? 'error' : 'warn', 'clock.drift', heartbeat)
    lastWarnedDriftMs = drift
  } else if (heartbeatCount % LOG_HEARTBEAT_EVERY === 0) {
    addLog('info', 'health.heartbeat', heartbeat)
  }
  updateMetrics(heartbeat)
}

function startHeartbeat() {
  stopHeartbeat()
  createHeartbeat()
  heartbeatTimer = setInterval(createHeartbeat, HEARTBEAT_MS)
}

function stopHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer)
  heartbeatTimer = null
}

function updateMetrics(heartbeat = null) {
  const clocks = heartbeat?.clocks || clockSnapshot()
  const drift = clocks.driftsMs.projectMinusOutput
  elements.wallTimeMetric.textContent = formatDuration(clocks.projectMs)
  elements.contextTimeMetric.textContent = formatDuration(clocks.contextMs)
  elements.inputTimeMetric.textContent = formatDuration(clocks.acceptedInputMs)
  elements.pcmTimeMetric.textContent = formatDuration(clocks.outputPcmMs)
  elements.driftMetric.textContent = `${drift >= 0 ? '+' : ''}${drift} ms`
  elements.driftMetricBox.classList.toggle('warning', Math.abs(drift) > DRIFT_WARN_MS && Math.abs(drift) <= DRIFT_ERROR_MS)
  elements.driftMetricBox.classList.toggle('danger', Math.abs(drift) > DRIFT_ERROR_MS)
  elements.levelMetric.textContent = formatDb(latestLevelDb)
  elements.contextMetric.textContent = heartbeat?.contextState || recorder?._AUDIO?.context?.state || '--'
  elements.bufferMetric.textContent = `${inputBufferCount} / ${pcmBufferCount}`
  elements.waveformSummary.textContent = waveformPoints.length
    ? `${waveformPoints.length} 个 10ms 波峰 · PCM ${formatDuration(clocks.outputPcmMs)} · ${markers.length} 个标记`
    : '等待录音数据'
}

function queueWaveformRender() {
  if (renderQueued) return
  renderQueued = true
  requestAnimationFrame(() => {
    renderQueued = false
    drawWaveform()
  })
}

function drawWaveform() {
  const canvas = elements.waveformCanvas
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const width = Math.max(1, Math.floor(rect.width * dpr))
  const height = Math.max(1, Math.floor(rect.height * dpr))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#151a1e'
  ctx.fillRect(0, 0, width, height)
  ctx.save()
  ctx.scale(dpr, dpr)
  const cssWidth = rect.width
  const cssHeight = rect.height
  const mid = cssHeight / 2

  ctx.strokeStyle = '#2b343a'
  ctx.lineWidth = 1
  for (let y = 0; y <= 4; y++) {
    const py = (cssHeight * y) / 4
    ctx.beginPath()
    ctx.moveTo(0, py + 0.5)
    ctx.lineTo(cssWidth, py + 0.5)
    ctx.stroke()
  }

  const durationSec = Math.max(1, waveformPoints.length / 100)
  const secondsStep = durationSec > 180 ? 30 : durationSec > 90 ? 15 : durationSec > 30 ? 5 : 1
  ctx.font = '10px Consolas, monospace'
  ctx.fillStyle = '#75838d'
  ctx.strokeStyle = '#232b30'
  for (let second = 0; second <= durationSec; second += secondsStep) {
    const x = (second / durationSec) * cssWidth
    ctx.beginPath()
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, cssHeight)
    ctx.stroke()
    ctx.fillText(`${second}s`, Math.min(cssWidth - 30, x + 3), 13)
  }

  if (waveformPoints.length) {
    ctx.strokeStyle = '#56c59b'
    ctx.lineWidth = 1
    const pointsPerPixel = waveformPoints.length / cssWidth
    ctx.beginPath()
    for (let x = 0; x < cssWidth; x++) {
      const start = Math.floor(x * pointsPerPixel)
      const end = Math.max(start + 1, Math.min(waveformPoints.length, Math.ceil((x + 1) * pointsPerPixel)))
      let min = 1
      let max = -1
      for (let i = start; i < end; i++) {
        if (waveformPoints[i][0] < min) min = waveformPoints[i][0]
        if (waveformPoints[i][1] > max) max = waveformPoints[i][1]
      }
      ctx.moveTo(x + 0.5, mid - max * mid * 0.9)
      ctx.lineTo(x + 0.5, mid - min * mid * 0.9)
    }
    ctx.stroke()
  }

  for (const marker of markers) {
    const markerPcmMs = marker.clocks?.outputPcmMs ?? marker.pcmMs ?? 0
    const x = durationSec ? (markerPcmMs / 1000 / durationSec) * cssWidth : 0
    ctx.strokeStyle = '#ffb84b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, cssHeight)
    ctx.stroke()
    ctx.fillStyle = '#ffcf7a'
    ctx.fillText(`M${marker.index}`, Math.min(cssWidth - 24, x + 3), cssHeight - 8)
  }
  ctx.restore()
}

function makeReport() {
  const clocks = clockSnapshot()
  return {
    schemaVersion: 3,
    diagnosticVersion: DIAGNOSTIC_VERSION,
    generatedAt: new Date().toISOString(),
    sessionId,
    sdkParity: {
      source: 'animal-web/packages/playground/apps/fx/iv-recorder/iv-recorder.js',
      differences: [
        'diagnostic copy exposes echoCancellation, noiseSuppression and deviceId options',
        'diagnostic copy accepts an externally owned shared MediaStream for same-source comparison',
        'diagnostic worklet reports process/empty-input/zero-input/quantum-gap counters once per second',
      ],
      productionDefaults: {
        echoCancellation: true,
        noiseSuppression: false,
        enableAGC: false,
        useVAD: false,
        outputSampleRate: SAMPLE_RATE,
      },
      reproducedLifecycle: {
        visibilityHiddenAutoPause: true,
        explicitStopBeforeExport: true,
        exportWAVFileCallsStopAgain: true,
        exportAndParsePeaksBinary: true,
      },
    },
    clockDefinitions: {
      projectMs: 'performance.now minus pauses completed by resume; mirrors Animation.getCurrentUs',
      effectiveActiveMs: 'project clock minus an unfinished pause at stop',
      contextMs: 'AudioContext.currentTime since project start minus observed pause intervals',
      acceptedInputMs: 'buffers accepted by IVRecorder._handleAudioBuffer, converted using input sample rate',
      outputPcmMs: 'audioProcessPcmData samples divided by 32000',
      rawIngress: 'all _handleAudioBuffer calls before the recorder recording/paused gate',
      workletStats: 'audio-thread counters posted every ~1s by the diagnostic worklet: processCalls/emptyInputCalls/framesIn/zeroFrames/quantumGap*',
      renderCapacity: 'AudioContext.renderCapacity update events; underrunRatio > 0 means the render thread missed realtime deadlines',
      trackStats: 'MediaStreamTrack.stats audio capture frame counters (deliveredFrames vs totalFrames, durations in ms)',
    },
    page: {
      href: location.href,
      secureContext: window.isSecureContext,
      visibilityState: document.visibilityState,
    },
    environment: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      isIPad: isIPadDevice(),
      maxTouchPoints: navigator.maxTouchPoints,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      online: navigator.onLine,
      standalone: navigator.standalone ?? window.matchMedia?.('(display-mode: standalone)')?.matches ?? false,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        pixelRatio: window.devicePixelRatio,
        orientation: screen.orientation?.type || null,
      },
      userAgentData: environmentDetails,
      mediaSupportedConstraints: navigator.mediaDevices?.getSupportedConstraints?.() || null,
    },
    config: activeConfig || getConfig(),
    devices: deviceSnapshot,
    initialTrack: trackSnapshot,
    finalTrack: finalTrackSnapshot,
    workletStats: {
      supported: inputTransport === 'audio-worklet' && workletStatsUpdates > 0,
      updates: workletStatsUpdates,
      baseline: workletStatsBaseline,
      latest: workletStatsLatest,
      delta: diffWorkletStats(workletStatsBaseline, workletStatsLatest),
      emptyInputWarnCount: workletEmptyInputWarns,
      quantumGapWarnCount: workletQuantumGapWarns,
    },
    renderCapacity: {
      supported: renderCapacitySupported,
      updates: renderCapacityUpdates,
      underrunEvents: renderCapacityUnderrunEvents,
      maxUnderrunRatio: renderCapacityMaxUnderrun,
      latest: renderCapacityLatest,
    },
    trackStats: {
      supported: trackStatsSupported,
      baseline: trackStatsBaseline,
      final: trackStatsFinal,
      delta: diffTrackStats(trackStatsBaseline, trackStatsFinal),
    },
    referenceRecorder: {
      supported: typeof MediaRecorder !== 'undefined',
      result: referenceSnapshot,
      events: referenceEvents,
    },
    comparison: {
      referenceDurationSec: referenceSnapshot?.mediaDurationSec ?? null,
      ivRecorderDurationSec: resultSnapshot?.wavDurationSec ?? null,
      referenceMinusIvMs: referenceSnapshot?.mediaDurationSec != null && resultSnapshot?.wavDurationSec != null
        ? Math.round((referenceSnapshot.mediaDurationSec - resultSnapshot.wavDurationSec) * 1000)
        : null,
    },
    wakeLock: {
      supported: !!navigator.wakeLock?.request,
      events: wakeLockEvents,
    },
    result: resultSnapshot,
    diagnosis: diagnosisSnapshot,
    summary: {
      state,
      clocks,
      capturedSamples,
      capturedSamplesBaseline,
      acceptedInputSamples,
      expectedOutputSamples: Math.round(expectedOutputSamples),
      rawIngressSamples,
      rawActiveSamples,
      rawPausedSamples,
      rawWorkletSamples,
      inputBufferCount,
      pcmBufferCount,
      rawIngressBufferCount,
      rawWorkletBufferCount,
      workerCompletedCount,
      eventCount: events.length,
      heartbeatCount: heartbeats.length,
      markerCount: markers.length,
    },
    chain: {
      inputTransport,
      rawIngressDurationMs: Math.round(rawIngressDurationMs),
      rawActiveDurationMs: Math.round(rawActiveDurationMs),
      rawPausedDurationMs: Math.round(rawPausedDurationMs),
      counters: chainCounters(),
    },
    stopSequence,
    pauses,
    markers,
    heartbeats,
    longTasks,
    waveform: {
      pointsPerSecond: SAMPLE_RATE / WAVE_SAMPLES_PER_POINT,
      minMaxPoints: waveformPoints,
    },
    pcmEnvelope: {
      intervalMs: ENVELOPE_MS,
      bins: pcmEnvelope,
      analysis: analyzeEnvelopeIntervals(pcmEnvelope),
    },
    rawInputEnvelope: {
      intervalMs: ENVELOPE_MS,
      bins: rawInputEnvelope,
      analysis: analyzeEnvelopeIntervals(rawInputEnvelope),
    },
    wavAnalysis,
    peaks: peaksSnapshot,
    events,
  }
}

let crcTable = null

function getCrcTable() {
  if (crcTable) return crcTable
  crcTable = new Uint32Array(256)
  for (let index = 0; index < 256; index++) {
    let value = index
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    crcTable[index] = value >>> 0
  }
  return crcTable
}

function crc32(bytes) {
  const table = getCrcTable()
  let value = 0xffffffff
  for (const byte of bytes) value = table[(value ^ byte) & 0xff] ^ (value >>> 8)
  return (value ^ 0xffffffff) >>> 0
}

function zipDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear())
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  }
}

function concatBytes(parts) {
  const length = parts.reduce((total, part) => total + part.byteLength, 0)
  const result = new Uint8Array(length)
  let offset = 0
  for (const part of parts) {
    result.set(part, offset)
    offset += part.byteLength
  }
  return result
}

async function createStoredZip(files) {
  const encoder = new TextEncoder()
  const localParts = []
  const centralParts = []
  let localOffset = 0
  const dos = zipDateTime()

  for (const file of files) {
    const name = encoder.encode(file.name)
    const data = new Uint8Array(await file.blob.arrayBuffer())
    const checksum = crc32(data)
    const localHeader = new Uint8Array(30)
    const localView = new DataView(localHeader.buffer)
    localView.setUint32(0, 0x04034b50, true)
    localView.setUint16(4, 20, true)
    localView.setUint16(6, 0x0800, true)
    localView.setUint16(8, 0, true)
    localView.setUint16(10, dos.time, true)
    localView.setUint16(12, dos.date, true)
    localView.setUint32(14, checksum, true)
    localView.setUint32(18, data.byteLength, true)
    localView.setUint32(22, data.byteLength, true)
    localView.setUint16(26, name.byteLength, true)
    localView.setUint16(28, 0, true)
    localParts.push(localHeader, name, data)

    const centralHeader = new Uint8Array(46)
    const centralView = new DataView(centralHeader.buffer)
    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint16(8, 0x0800, true)
    centralView.setUint16(10, 0, true)
    centralView.setUint16(12, dos.time, true)
    centralView.setUint16(14, dos.date, true)
    centralView.setUint32(16, checksum, true)
    centralView.setUint32(20, data.byteLength, true)
    centralView.setUint32(24, data.byteLength, true)
    centralView.setUint16(28, name.byteLength, true)
    centralView.setUint16(30, 0, true)
    centralView.setUint16(32, 0, true)
    centralView.setUint16(34, 0, true)
    centralView.setUint16(36, 0, true)
    centralView.setUint32(38, 0, true)
    centralView.setUint32(42, localOffset, true)
    centralParts.push(centralHeader, name)
    localOffset += localHeader.byteLength + name.byteLength + data.byteLength
  }

  const centralDirectory = concatBytes(centralParts)
  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)
  endView.setUint32(0, 0x06054b50, true)
  endView.setUint16(4, 0, true)
  endView.setUint16(6, 0, true)
  endView.setUint16(8, files.length, true)
  endView.setUint16(10, files.length, true)
  endView.setUint32(12, centralDirectory.byteLength, true)
  endView.setUint32(16, localOffset, true)
  endView.setUint16(20, 0, true)
  return new Blob([...localParts, centralDirectory, end], { type: 'application/zip' })
}

function safeFilenamePart(value) {
  return String(value || '').trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64)
}

async function buildDiagnosticPackage() {
  if (diagnosticPackageFile) return diagnosticPackageFile
  if (!referenceFile || !audioFile) throw new Error('双路录音结果尚未准备完成')
  const report = makeReport()
  const reportBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const zip = await createStoredZip([
    { name: 'diagnostic.json', blob: reportBlob },
    { name: 'media-recorder-reference.' + referenceExtension(referenceFile.type), blob: referenceFile },
    { name: 'iv-recorder.wav', blob: audioFile },
  ])
  const casePrefix = safeFilenamePart(activeConfig?.caseId)
  const filename = `${casePrefix ? `${casePrefix}-` : ''}${sessionId}-diagnostic.zip`
  diagnosticPackageFile = new File([zip], filename, { type: 'application/zip' })
  addLog('info', 'package.created', { filename, bytes: diagnosticPackageFile.size })
  return diagnosticPackageFile
}

async function downloadDiagnosticPackage() {
  try {
    const file = await buildDiagnosticPackage()
    downloadBlob(file, file.name)
    addLog('info', 'package.downloaded', { filename: file.name, bytes: file.size })
  } catch (error) {
    addLog('error', 'package.download.failed', error)
    alert(`诊断包生成失败：${error?.message || error}`)
  }
}

async function shareDiagnosticPackage() {
  try {
    const file = await buildDiagnosticPackage()
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({
        title: 'IVRecorder 录音诊断包',
        text: activeConfig?.caseId ? `案例编号：${activeConfig.caseId}` : 'IVRecorder 双路录音诊断',
        files: [file],
      })
      addLog('info', 'package.shared', { filename: file.name, bytes: file.size })
      return
    }
    await downloadDiagnosticPackage()
    addLog('info', 'package.share.unsupported', { fallback: 'download' })
  } catch (error) {
    if (error?.name === 'AbortError') {
      addLog('info', 'package.share.cancelled')
      return
    }
    addLog('warn', 'package.share.failed', { error: normalizeValue(error), fallback: 'download' })
    await downloadDiagnosticPackage()
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function downloadReport() {
  const report = makeReport()
  downloadBlob(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }), `${sessionId || 'ivdiag-no-session'}.json`)
  addLog('info', 'report.downloaded')
}

async function copySummary() {
  const report = makeReport()
  const summary = [
    `sessionId=${report.sessionId}`,
    `config=${JSON.stringify(report.config)}`,
    `track=${JSON.stringify(report.initialTrack?.settings || {})}`,
    `clocks=${JSON.stringify(report.summary.clocks)}`,
    `diagnosis=${JSON.stringify(report.diagnosis)}`,
    `chain=${JSON.stringify(report.chain)}`,
    `reference=${JSON.stringify(report.referenceRecorder?.result || {})}`,
    `comparison=${JSON.stringify(report.comparison || {})}`,
    `wav=${JSON.stringify(report.result?.wav || {})}`,
    `markers=${JSON.stringify(report.markers)}`,
    `userAgent=${report.environment.userAgent}`,
  ].join('\n')
  try {
    await navigator.clipboard.writeText(summary)
    addLog('info', 'summary.copied')
  } catch (error) {
    addLog('error', 'summary.copy.failed', error)
  }
}

function initializeGlobalDiagnostics() {
  window.addEventListener('error', event => addLog('error', 'window.error', { message: event.message, filename: event.filename, lineno: event.lineno, colno: event.colno, error: event.error }))
  window.addEventListener('unhandledrejection', event => addLog('error', 'window.unhandledrejection', event.reason))
  document.addEventListener('visibilitychange', () => {
    addLog(document.hidden ? 'warn' : 'info', 'page.visibilitychange', {
      visibilityState: document.visibilityState,
      hidden: document.hidden,
      state,
      clocks: clockSnapshot(),
    })
    if (document.hidden && state === 'recording') pauseRecording('visibility-hidden')
    if (!document.hidden && (state === 'recording' || state === 'paused')) void requestScreenWakeLock('visibility-visible')
  })
  document.addEventListener('freeze', () => addLog('warn', 'page.freeze', { clocks: clockSnapshot() }))
  document.addEventListener('resume', () => addLog('info', 'page.resume', { clocks: clockSnapshot() }))
  window.addEventListener('pagehide', event => addLog('warn', 'page.pagehide', { persisted: event.persisted, clocks: clockSnapshot() }))
  window.addEventListener('pageshow', event => addLog('info', 'page.pageshow', { persisted: event.persisted, clocks: clockSnapshot() }))
  window.addEventListener('focus', () => addLog('info', 'window.focus'))
  window.addEventListener('blur', () => addLog('warn', 'window.blur'))
  window.addEventListener('online', () => addLog('info', 'network.online'))
  window.addEventListener('offline', () => addLog('warn', 'network.offline'))
  navigator.mediaDevices?.addEventListener?.('devicechange', async () => {
    addLog('warn', 'device.change')
    await refreshDevices(false)
  })
  navigator.permissions?.query?.({ name: 'microphone' }).then(status => {
    addLog('info', 'permission.microphone', { state: status.state })
    status.addEventListener('change', () => addLog('warn', 'permission.microphone.change', { state: status.state }))
  }).catch(error => addLog('warn', 'permission.query.failed', error))

  if (typeof PerformanceObserver !== 'undefined') {
    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const item = {
            name: entry.name,
            entryType: entry.entryType,
            startTimeMs: Number(entry.startTime.toFixed(2)),
            durationMs: Number(entry.duration.toFixed(2)),
            attribution: normalizeValue(entry.attribution || []),
          }
          longTasks.push(item)
          if (longTasks.length > 5000) longTasks.shift()
          addLog(entry.duration >= 200 ? 'error' : 'warn', 'performance.longtask', item)
        }
      })
      observer.observe({ type: 'longtask', buffered: true })
      addLog('info', 'performance.longtask-observer.ready')
    } catch (error) {
      addLog('info', 'performance.longtask-observer.unsupported', error)
    }
  }

  navigator.userAgentData?.getHighEntropyValues?.([
    'architecture',
    'bitness',
    'model',
    'platformVersion',
    'uaFullVersion',
    'fullVersionList',
  ]).then(details => {
    environmentDetails = normalizeValue(details)
    addLog('info', 'environment.user-agent-data', environmentDetails)
  }).catch(error => addLog('warn', 'environment.user-agent-data.failed', error))
}

elements.startBtn.addEventListener('click', startRecording)
elements.pauseBtn.addEventListener('click', pauseOrResume)
elements.stopBtn.addEventListener('click', stopRecording)
elements.markerBtn.addEventListener('click', addMarker)
elements.referencePlaybackMarkerBtn.addEventListener('click', () => addPlaybackMarker('media-recorder-reference'))
elements.playbackMarkerBtn.addEventListener('click', () => addPlaybackMarker('iv-recorder'))
elements.refreshDevicesBtn.addEventListener('click', () => refreshDevices(true))
elements.sharePackageBtn.addEventListener('click', shareDiagnosticPackage)
elements.downloadPackageBtn.addEventListener('click', downloadDiagnosticPackage)
elements.downloadLogBtn.addEventListener('click', downloadReport)
elements.downloadResultJsonBtn.addEventListener('click', downloadReport)
elements.copyLogBtn.addEventListener('click', copySummary)
elements.clearLogBtn.addEventListener('click', () => {
  displayLines = []
  elements.logOutput.textContent = ''
})
elements.downloadWavBtn.addEventListener('click', () => {
  if (audioFile) downloadBlob(audioFile, audioFile.name)
})
elements.downloadReferenceBtn.addEventListener('click', () => {
  if (referenceFile) downloadBlob(referenceFile, referenceFile.name)
})
window.addEventListener('resize', queueWaveformRender)
window.addEventListener('beforeunload', event => {
  if (state === 'recording' || state === 'paused') {
    event.preventDefault()
    event.returnValue = ''
  }
})

captureSdkConsole()
initializeGlobalDiagnostics()
setState('idle', '未开始')
const browserName = /EdgiOS|Edg\//.test(navigator.userAgent)
  ? 'Edge'
  : /CriOS|Chrome\//.test(navigator.userAgent)
    ? 'Chrome'
    : /Safari\//.test(navigator.userAgent)
      ? 'Safari'
      : '浏览器'
elements.environmentText.textContent = `${browserName} · ${isIPadDevice() ? 'iPad' : navigator.platform || '未知平台'} · 原生/IVRecorder 双路`
elements.secureContextText.textContent = window.isSecureContext ? '安全上下文：是' : '安全上下文：否，需要 HTTPS 或 localhost'
addLog('info', 'diagnostic.loaded', { secureContext: window.isSecureContext, userAgent: navigator.userAgent, platform: navigator.platform, isIPad: isIPadDevice() })
refreshDevices(false)
updateMetrics()
queueWaveformRender()
