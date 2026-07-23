var k = Object.defineProperty;
var B = (r, e, I) => e in r ? k(r, e, { enumerable: !0, configurable: !0, writable: !0, value: I }) : r[e] = I;
var n = (r, e, I) => B(r, typeof e != "symbol" ? e + "" : e, I);
const p = "dmFyIHggPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7CnZhciBiID0gKGUsIHQsIHMpID0+IHQgaW4gZSA/IHgoZSwgdCwgeyBlbnVtZXJhYmxlOiAhMCwgY29uZmlndXJhYmxlOiAhMCwgd3JpdGFibGU6ICEwLCB2YWx1ZTogcyB9KSA6IGVbdF0gPSBzOwp2YXIgdSA9IChlLCB0LCBzKSA9PiBiKGUsIHR5cGVvZiB0ICE9ICJzeW1ib2wiID8gdCArICIiIDogdCwgcyk7CmZ1bmN0aW9uIEMoZSkgewogIGNvbnN0IHQgPSBuZXcgSW50MTZBcnJheShlLmxlbmd0aCk7CiAgZm9yIChsZXQgcyA9IDA7IHMgPCBlLmxlbmd0aDsgcysrKSB7CiAgICBjb25zdCByID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIGVbc10pKTsKICAgIHRbc10gPSByIDwgMCA/IHIgKiAzMjc2OCA6IHIgKiAzMjc2NzsKICB9CiAgcmV0dXJuIHQ7Cn0KbGV0IHcgPSAxLCBtID0gNDQxMDAsIGcgPSAzMmUzLCBCID0gNDA5NiwgeSA9ICExLCBXID0gITEsIEwgPSBbXSwgTyA9IFtdLCBkID0gbnVsbDsKc2VsZi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7CiAgaWYgKCEoIWUuZGF0YSB8fCAhZS5kYXRhLmNvbW1hbmQpKQogICAgc3dpdGNoIChlLmRhdGEuY29tbWFuZCkgewogICAgICBjYXNlICJpbml0IjogewogICAgICAgIHooZS5kYXRhLmNvbmZpZyB8fCB7fSk7CiAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgICAgY2FzZSAiYXVkaW9Qcm9jZXNzIjogewogICAgICAgIGlmICghZS5kYXRhLmJ1ZmZlcikgcmV0dXJuOwogICAgICAgIEEoZS5kYXRhLmJ1ZmZlcik7CiAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgIH0KfTsKZnVuY3Rpb24geihlKSB7CiAgY29uc3QgdCA9IG0sIHMgPSBnOwogIG0gPSBlLnNhbXBsZVJhdGUgfHwgbSwgZyA9IGUub3V0cHV0U2FtcGxlUmF0ZSB8fCBnLCBCID0gZS5vdXRwdXRCdWZmZXJMZW5ndGggfHwgQiwgdyA9IGUubnVtQ2hhbm5lbHMgfHwgdywgeSA9IGUudXNlVkFEIHx8IHksIFcgPSBlLnVzZVZWRCB8fCBXLCBMID0gW10sIE8gPSBbXSwgKCFkIHx8IHQgIT09IG0gfHwgcyAhPT0gZykgJiYgKGQgPSBuZXcgTShtLCBnLCB3LCBCLCAhMCkpLCBjb25zb2xlLmxvZygKICAgICJbUmVjb3JkZXJXb3JrZXJdIGluaXQ6IiwKICAgICJpbnB1dFNhbXBsZVJhdGU9IiwKICAgIG0sCiAgICAib3V0cHV0U2FtcGxlUmF0ZT0iLAogICAgZywKICAgICJpbnB1dEJ1ZmZlckxlbmd0aD0iLAogICAgQiwKICAgICJyZXNhbXBsZXJPdXRwdXRDYXBhY2l0eT0iLAogICAgZC5nZXRPdXRwdXRCdWZmZXJDYXBhY2l0eSgpCiAgKTsKfQpmdW5jdGlvbiBBKGUpIHsKICBMLnB1c2goZSksIGQgfHwgKGQgPSBuZXcgTShtLCBnLCB3LCBCLCAhMCkpOwogIGNvbnN0IHQgPSBlLmxlbmd0aCwgcyA9IFtdOwogIGZvciAobGV0IGkgPSAwLCBjID0gZS5sZW5ndGg7IGkgPCBjOyBpKyspCiAgICBzLnB1c2goZVtpXSk7CiAgY29uc3QgciA9IGQucmVzYW1wbGVyKHMpLCBmID0gTWF0aC5yb3VuZCh0ICogZyAvIG0pOwogIE1hdGguYWJzKHIgLSBmKSA+IE1hdGgubWF4KDIsIGYgKiAwLjA1KSAmJiBjb25zb2xlLndhcm4oCiAgICAiW1JlY29yZGVyV29ya2VyXSByZXNhbXBsZSBsZW5ndGggbWlzbWF0Y2g6IiwKICAgICJpbnB1dExlbmd0aD0iLAogICAgdCwKICAgICJhY3R1YWxMZW5ndGg9IiwKICAgIHIsCiAgICAiZXhwZWN0ZWRMZW5ndGg9IiwKICAgIGYsCiAgICAic2FtcGxlUmF0ZT0iLAogICAgbSwKICAgICItPiIsCiAgICBnLAogICAgIm91dHB1dENhcGFjaXR5PSIsCiAgICBkLmdldE91dHB1dEJ1ZmZlckNhcGFjaXR5KCkKICApOwogIGNvbnN0IG4gPSBuZXcgRmxvYXQzMkFycmF5KHIpOwogIGZvciAobGV0IGkgPSAwOyBpIDwgcjsgaSsrKQogICAgbltpXSA9IGQub3V0cHV0QnVmZmVyW2ldOwogIGNvbnN0IGwgPSBDKG4pLCBoID0gW107CiAgZm9yIChsZXQgaSA9IDAsIGMgPSBsLmxlbmd0aDsgaSA8IGM7IGkrKykKICAgIGgucHVzaChsW2ldKTsKICBmb3IgKDsgaC5sZW5ndGggPiAwOyApIHsKICAgIGNvbnN0IGkgPSBuZXcgSW50MTZBcnJheShoLnNwbGljZSgwLCAzMjApKTsKICAgIE8ucHVzaChpKSwgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICAgIGNvbW1hbmQ6ICJleHBvcnRSZXNhbXBsZXJBdWRpbyIsCiAgICAgIGRhdGE6IHsKICAgICAgICBidWZmZXI6IGksCiAgICAgICAgbGVuZ3RoOiBpLmxlbmd0aAogICAgICB9CiAgICB9KTsKICB9CiAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICBjb21tYW5kOiAiYXVkaW9Qcm9jZXNzQ29tcGxldGUiCiAgfSk7Cn0KY2xhc3MgTSB7CiAgY29uc3RydWN0b3IodCwgcywgciwgZiwgbikgewogICAgdSh0aGlzLCAiZnJvbVNhbXBsZVJhdGUiKTsKICAgIHUodGhpcywgInRvU2FtcGxlUmF0ZSIpOwogICAgdSh0aGlzLCAiY2hhbm5lbHMiKTsKICAgIHUodGhpcywgIm91dHB1dEJ1ZmZlclNpemUiKTsKICAgIHUodGhpcywgIm5vUmV0dXJuIik7CiAgICB1KHRoaXMsICJyYXRpb1dlaWdodCIsIDApOwogICAgdSh0aGlzLCAibGFzdFdlaWdodCIsIDApOwogICAgdSh0aGlzLCAidGFpbEV4aXN0cyIsICExKTsKICAgIHUodGhpcywgIm91dHB1dEJ1ZmZlciIsIG5ldyBGbG9hdDMyQXJyYXkoMCkpOwogICAgdSh0aGlzLCAibGFzdE91dHB1dCIsIG5ldyBGbG9hdDMyQXJyYXkoMCkpOwogICAgdSh0aGlzLCAicmVzYW1wbGVyIik7CiAgICB0aGlzLmZyb21TYW1wbGVSYXRlID0gdCwgdGhpcy50b1NhbXBsZVJhdGUgPSBzLCB0aGlzLmNoYW5uZWxzID0gciB8IDAsIHRoaXMub3V0cHV0QnVmZmVyU2l6ZSA9IGYsIHRoaXMubm9SZXR1cm4gPSAhIW4sIHRoaXMuaW5pdGlhbGl6ZSgpOwogIH0KICBnZXRPdXRwdXRCdWZmZXJDYXBhY2l0eSgpIHsKICAgIGNvbnN0IHQgPSBNYXRoLmNlaWwodGhpcy5vdXRwdXRCdWZmZXJTaXplICogdGhpcy50b1NhbXBsZVJhdGUgLyB0aGlzLmZyb21TYW1wbGVSYXRlKTsKICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm91dHB1dEJ1ZmZlclNpemUsIHQgKyB0aGlzLmNoYW5uZWxzICogMik7CiAgfQogIGluaXRpYWxpemUoKSB7CiAgICBpZiAodGhpcy5mcm9tU2FtcGxlUmF0ZSA+IDAgJiYgdGhpcy50b1NhbXBsZVJhdGUgPiAwICYmIHRoaXMuY2hhbm5lbHMgPiAwKQogICAgICB0aGlzLmZyb21TYW1wbGVSYXRlID09PSB0aGlzLnRvU2FtcGxlUmF0ZSA/ICh0aGlzLnJlc2FtcGxlciA9IHRoaXMuYnlwYXNzUmVzYW1wbGVyLCB0aGlzLnJhdGlvV2VpZ2h0ID0gMSkgOiAodGhpcy5mcm9tU2FtcGxlUmF0ZSA8IHRoaXMudG9TYW1wbGVSYXRlID8gKHRoaXMubGFzdFdlaWdodCA9IDEsIHRoaXMucmVzYW1wbGVyID0gdGhpcy5jb21waWxlTGluZWFySW50ZXJwb2xhdGlvbi5iaW5kKHRoaXMpKSA6ICh0aGlzLnRhaWxFeGlzdHMgPSAhMSwgdGhpcy5sYXN0V2VpZ2h0ID0gMCwgdGhpcy5yZXNhbXBsZXIgPSB0aGlzLmNvbXBpbGVNdWx0aVRhcC5iaW5kKHRoaXMpKSwgdGhpcy5yYXRpb1dlaWdodCA9IHRoaXMuZnJvbVNhbXBsZVJhdGUgLyB0aGlzLnRvU2FtcGxlUmF0ZSwgdGhpcy5pbml0aWFsaXplQnVmZmVycygpKTsKICAgIGVsc2UKICAgICAgdGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIHNldHRpbmdzIHNwZWNpZmllZCBmb3IgdGhlIHJlc2FtcGxlci4iKTsKICB9CiAgY29tcGlsZUxpbmVhckludGVycG9sYXRpb24odCkgewogICAgY29uc3QgcyA9IHQubGVuZ3RoLCByID0gdGhpcy5vdXRwdXRCdWZmZXIubGVuZ3RoOwogICAgaWYgKHMgJSB0aGlzLmNoYW5uZWxzID09PSAwKQogICAgICBpZiAocyA+IDApIHsKICAgICAgICBjb25zdCBmID0gdGhpcy5yYXRpb1dlaWdodDsKICAgICAgICBsZXQgbiA9IHRoaXMubGFzdFdlaWdodCwgbCA9IDAsIGggPSAwLCBpID0gMDsKICAgICAgICBjb25zdCBjID0gdGhpcy5vdXRwdXRCdWZmZXI7CiAgICAgICAgbGV0IG87CiAgICAgICAgZm9yICg7IG4gPCAxOyBuICs9IGYpCiAgICAgICAgICBmb3IgKGggPSBuICUgMSwgbCA9IDEgLSBoLCBvID0gMDsgbyA8IHRoaXMuY2hhbm5lbHM7ICsrbykKICAgICAgICAgICAgY1tpKytdID0gdGhpcy5sYXN0T3V0cHV0W29dICogbCArIHRbb10gKiBoOwogICAgICAgIG4tLTsKICAgICAgICBsZXQgcDsKICAgICAgICBjb25zdCBSID0gcyAtIHRoaXMuY2hhbm5lbHM7CiAgICAgICAgZm9yIChwID0gTWF0aC5mbG9vcihuKSAqIHRoaXMuY2hhbm5lbHM7IGkgPCByICYmIHAgPCBSOyApIHsKICAgICAgICAgIGZvciAoaCA9IG4gJSAxLCBsID0gMSAtIGgsIG8gPSAwOyBvIDwgdGhpcy5jaGFubmVsczsgKytvKQogICAgICAgICAgICBjW2krK10gPSB0W3AgKyBvXSAqIGwgKyB0W3AgKyB0aGlzLmNoYW5uZWxzICsgb10gKiBoOwogICAgICAgICAgbiArPSBmLCBwID0gTWF0aC5mbG9vcihuKSAqIHRoaXMuY2hhbm5lbHM7CiAgICAgICAgfQogICAgICAgIGZvciAobyA9IDA7IG8gPCB0aGlzLmNoYW5uZWxzOyArK28pCiAgICAgICAgICB0aGlzLmxhc3RPdXRwdXRbb10gPSB0W3ArK107CiAgICAgICAgcmV0dXJuIHRoaXMubGFzdFdlaWdodCA9IG4gJSAxLCB0aGlzLmJ1ZmZlclNsaWNlKGkpOwogICAgICB9IGVsc2UKICAgICAgICByZXR1cm4gdGhpcy5ub1JldHVybiwgMDsKICAgIGVsc2UKICAgICAgdGhyb3cgbmV3IEVycm9yKCJCdWZmZXIgd2FzIG9mIGluY29ycmVjdCBzYW1wbGUgbGVuZ3RoLiIpOwogIH0KICBjb21waWxlTXVsdGlUYXAodCkgewogICAgY29uc3QgcyA9IFtdLCByID0gdC5sZW5ndGgsIGYgPSB0aGlzLm91dHB1dEJ1ZmZlci5sZW5ndGg7CiAgICBpZiAociAlIHRoaXMuY2hhbm5lbHMgPT09IDApCiAgICAgIGlmIChyID4gMCkgewogICAgICAgIGNvbnN0IG4gPSB0aGlzLnJhdGlvV2VpZ2h0OwogICAgICAgIGxldCBsID0gMDsKICAgICAgICBmb3IgKGxldCBTID0gMDsgUyA8IHRoaXMuY2hhbm5lbHM7ICsrUykKICAgICAgICAgIHNbU10gPSAwOwogICAgICAgIGxldCBoID0gMCwgaSA9IDAsIGMgPSAhdGhpcy50YWlsRXhpc3RzOwogICAgICAgIHRoaXMudGFpbEV4aXN0cyA9ICExOwogICAgICAgIGNvbnN0IG8gPSB0aGlzLm91dHB1dEJ1ZmZlcjsKICAgICAgICBsZXQgcCA9IDAsIFIgPSAwLCBhOwogICAgICAgIGRvIHsKICAgICAgICAgIGlmIChjKQogICAgICAgICAgICBmb3IgKGwgPSBuLCBhID0gMDsgYSA8IHRoaXMuY2hhbm5lbHM7ICsrYSkKICAgICAgICAgICAgICBzW2FdID0gMDsKICAgICAgICAgIGVsc2UgewogICAgICAgICAgICBmb3IgKGwgPSB0aGlzLmxhc3RXZWlnaHQsIGEgPSAwOyBhIDwgdGhpcy5jaGFubmVsczsgKythKQogICAgICAgICAgICAgIHNbYV0gKz0gdGhpcy5sYXN0T3V0cHV0W2FdOwogICAgICAgICAgICBjID0gITA7CiAgICAgICAgICB9CiAgICAgICAgICBmb3IgKDsgbCA+IDAgJiYgaCA8IHI7ICkKICAgICAgICAgICAgaWYgKGkgPSAxICsgaCAtIFIsIGwgPj0gaSkgewogICAgICAgICAgICAgIGZvciAoYSA9IDA7IGEgPCB0aGlzLmNoYW5uZWxzOyArK2EpCiAgICAgICAgICAgICAgICBzW2FdICs9IHRbaCsrXSAqIGk7CiAgICAgICAgICAgICAgUiA9IGgsIGwgLT0gaTsKICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICBmb3IgKGEgPSAwOyBhIDwgdGhpcy5jaGFubmVsczsgKythKQogICAgICAgICAgICAgICAgc1thXSArPSB0W2ggKyBhXSAqIGw7CiAgICAgICAgICAgICAgUiArPSBsLCBsID0gMDsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgICAgaWYgKGwgPT09IDApCiAgICAgICAgICAgIGZvciAoYSA9IDA7IGEgPCB0aGlzLmNoYW5uZWxzOyArK2EpCiAgICAgICAgICAgICAgb1twKytdID0gc1thXSAvIG47CiAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgZm9yICh0aGlzLmxhc3RXZWlnaHQgPSBsLCBhID0gMDsgYSA8IHRoaXMuY2hhbm5lbHM7ICsrYSkKICAgICAgICAgICAgICB0aGlzLmxhc3RPdXRwdXRbYV0gPSBzW2FdOwogICAgICAgICAgICB0aGlzLnRhaWxFeGlzdHMgPSAhMDsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfSB3aGlsZSAoaCA8IHIgJiYgcCA8IGYpOwogICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlclNsaWNlKHApOwogICAgICB9IGVsc2UKICAgICAgICByZXR1cm4gdGhpcy5ub1JldHVybiwgMDsKICAgIGVsc2UKICAgICAgdGhyb3cgbmV3IEVycm9yKCJCdWZmZXIgd2FzIG9mIGluY29ycmVjdCBzYW1wbGUgbGVuZ3RoLiIpOwogIH0KICBieXBhc3NSZXNhbXBsZXIodCkgewogICAgcmV0dXJuIHRoaXMubm9SZXR1cm4gPyAodGhpcy5vdXRwdXRCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHQpLCB0Lmxlbmd0aCkgOiAwOwogIH0KICBidWZmZXJTbGljZSh0KSB7CiAgICBpZiAodGhpcy5ub1JldHVybikKICAgICAgcmV0dXJuIHQ7CiAgICB0cnkgewogICAgICByZXR1cm4gdDsKICAgIH0gY2F0Y2ggewogICAgICB0cnkgewogICAgICAgIHJldHVybiB0OwogICAgICB9IGNhdGNoIHsKICAgICAgICByZXR1cm4gdDsKICAgICAgfQogICAgfQogIH0KICBpbml0aWFsaXplQnVmZmVycygpIHsKICAgIHRyeSB7CiAgICAgIHRoaXMub3V0cHV0QnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmdldE91dHB1dEJ1ZmZlckNhcGFjaXR5KCkpLCB0aGlzLmxhc3RPdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuY2hhbm5lbHMpOwogICAgfSBjYXRjaCB7CiAgICAgIHRoaXMub3V0cHV0QnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSgwKSwgdGhpcy5sYXN0T3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheSgwKTsKICAgIH0KICB9Cn0K", E = (r) => Uint8Array.from(atob(r), (e) => e.charCodeAt(0)), T = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", E(p)], { type: "text/javascript;charset=utf-8" });
function x(r) {
  let e;
  try {
    if (e = T && (self.URL || self.webkitURL).createObjectURL(T), !e) throw "";
    const I = new Worker(e, {
      type: "module",
      name: r == null ? void 0 : r.name
    });
    return I.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), I;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + p,
      {
        type: "module",
        name: r == null ? void 0 : r.name
      }
    );
  }
}
const m = "b25tZXNzYWdlID0gZnVuY3Rpb24oZSkgewogIHN3aXRjaCAoRChlLmRhdGEpLCBlLmRhdGEuY29tbWFuZCkgewogICAgY2FzZSAiaW5pdCI6CiAgICAgIHIxKCk7CiAgICAgIGJyZWFrOwogICAgY2FzZSAiYXBwZW5kRGF0YSI6CiAgICAgIG4xKGUuZGF0YS5wY21EYXRhLCBlLmRhdGEublNhbXBsZXMpOwogICAgICBicmVhazsKICB9Cn07CmZ1bmN0aW9uIEQoZSkgewogIHBvc3RNZXNzYWdlKHsgdHlwZTogImRlYnVnIiwgbWVzc2FnZTogZSB9KTsKfQp2YXIgaSA9IHsgRVNWQURfU0lMRU5DRTogMCwgRVNWQURfQ0hFQ0tfQkVHSU46IDEsIEVTVkFEX0FDVElWRTogMiwgRVNWQURfQ0hFQ0tfRU5EOiAzLCBFU1ZBRF9JTkFDVElWRTogNCB9LCBTID0gMTYwICogMTAyNCwgdSA9IDIwMCwgbSA9IDgwLCBxID0gMTI5LCBIID0gMywgeCA9IDIwLCBRID0gMjAsIFcgPSAyMDAsIE0gPSBxLCB6ID0gMTgsIEogPSA1LCBZID0gNCwgWCA9IDMsICQgPSAyNSwgeSA9IDQwLCBCID0gMjU2LCBaID0gOCwgaiA9IDI5MDcyNzAsIEsgPSAyOTA3MjcwMCwgYTEgPSBbMCwgMzIsIDY0LCA5NiwgMTI4LCAxNjAsIDE5MSwgMjIzLCAyNTUsIDI4NywgMzE4LCAzNTAsIDM4MiwgNDEzLCA0NDUsIDQ3NywgNTA4LCA1NDAsIDU3MSwgNjAyLCA2MzQsIDY2NSwgNjk3LCA3MjgsIDc1OSwgNzkwLCA4MjIsIDg1MywgODg0LCA5MTUsIDk0NiwgOTc3LCAxMDA4LCAxMDM5LCAxMDcwLCAxMTAxLCAxMTMyLCAxMTYzLCAxMTk0LCAxMjI1LCAxMjU2LCAxMjg2LCAxMzE3LCAxMzQ4LCAxMzc5LCAxNDA5LCAxNDQwLCAxNDcxLCAxNTAxLCAxNTMyLCAxNTYyLCAxNTkzLCAxNjIzLCAxNjU0LCAxNjg0LCAxNzE0LCAxNzQ1LCAxNzc1LCAxODA1LCAxODM2LCAxODY2LCAxODk2LCAxOTI2LCAxOTU2LCAxOTg3LCAyMDE3LCAyMDQ3LCAyMDc3LCAyMTA3LCAyMTM3LCAyMTY3LCAyMTk3LCAyMjI3LCAyMjU2LCAyMjg2LCAyMzE2LCAyMzQ2LCAyMzc2LCAyNDA2LCAyNDM1LCAyNDY1LCAyNDk1LCAyNTI0LCAyNTU0LCAyNTgzLCAyNjEzLCAyNjQzLCAyNjcyLCAyNzAyLCAyNzMxLCAyNzYwLCAyNzkwLCAyODE5LCAyODQ5LCAyODc4LCAyOTA3LCAyOTM2LCAyOTY2LCAyOTk1LCAzMDI0LCAzMDUzLCAzMDgyLCAzMTExLCAzMTQxLCAzMTcwLCAzMTk5LCAzMjI4LCAzMjU3LCAzMjg2LCAzMzE1LCAzMzQzLCAzMzcyLCAzNDAxLCAzNDMwLCAzNDU5LCAzNDg4LCAzNTE2LCAzNTQ1LCAzNTc0LCAzNjAzLCAzNjMxLCAzNjYwLCAzNjg4LCAzNzE3LCAzNzQ2LCAzNzc0LCAzODAzLCAzODMxLCAzODYwLCAzODg4LCAzOTE2LCAzOTQ1LCAzOTczLCA0MDAxLCA0MDMwLCA0MDU4LCA0MDg2LCA0MTE1LCA0MTQzLCA0MTcxLCA0MTk5LCA0MjI3LCA0MjU1LCA0MjgzLCA0MzExLCA0MzQwLCA0MzY4LCA0Mzk2LCA0NDI0LCA0NDUxLCA0NDc5LCA0NTA3LCA0NTM1LCA0NTYzLCA0NTkxLCA0NjE5LCA0NjQ2LCA0Njc0LCA0NzAyLCA0NzMwLCA0NzU3LCA0Nzg1LCA0ODEzLCA0ODQwLCA0ODY4LCA0ODk1LCA0OTIzLCA0OTUwLCA0OTc4LCA1MDA1LCA1MDMzLCA1MDYwLCA1MDg4LCA1MTE1LCA1MTQzLCA1MTcwLCA1MTk3LCA1MjI0LCA1MjUyLCA1Mjc5LCA1MzA2LCA1MzMzLCA1MzYxLCA1Mzg4LCA1NDE1LCA1NDQyLCA1NDY5LCA1NDk2LCA1NTIzLCA1NTUwLCA1NTc3LCA1NjA0LCA1NjMxLCA1NjU4LCA1Njg1LCA1NzEyLCA1NzM5LCA1NzY2LCA1NzkyLCA1ODE5LCA1ODQ2LCA1ODczLCA1OTAwLCA1OTI2LCA1OTUzLCA1OTgwLCA2MDA2LCA2MDMzLCA2MDYwLCA2MDg2LCA2MTEzLCA2MTM5LCA2MTY2LCA2MTkyLCA2MjE5LCA2MjQ1LCA2MjcyLCA2Mjk4LCA2MzI0LCA2MzUxLCA2Mzc3LCA2NDAzLCA2NDMwLCA2NDU2LCA2NDgyLCA2NTA5LCA2NTM1LCA2NTYxLCA2NTg3LCA2NjEzLCA2NjQwLCA2NjY2LCA2NjkyLCA2NzE4LCA2NzQ0LCA2NzcwLCA2Nzk2LCA2ODIyLCA2ODQ4LCA2ODc0LCA2OTAwLCA2OTI2LCA2OTUyLCA2OTc3LCA3MDAzLCA3MDI5LCA3MDU1LCA3MDgxLCA3MTA3LCA3MTMyLCA3MTU4LCA3MTg0LCA3MjA5LCA3MjM1LCA3MjYxLCA3Mjg2LCA3MzEyLCA3MzM4LCA3MzYzLCA3Mzg5LCA3NDE0LCA3NDQwLCA3NDY1LCA3NDkxLCA3NTE2LCA3NTQyLCA3NTY3LCA3NTkyLCA3NjE4LCA3NjQzLCA3NjY4LCA3Njk0LCA3NzE5LCA3NzQ0LCA3NzcwLCA3Nzk1LCA3ODIwLCA3ODQ1LCA3ODcwLCA3ODk2LCA3OTIxLCA3OTQ2LCA3OTcxLCA3OTk2LCA4MDIxLCA4MDQ2LCA4MDcxLCA4MDk2LCA4MTIxLCA4MTQ2LCA4MTcxLCA4MTk2LCA4MjIxLCA4MjQ2LCA4MjcxLCA4Mjk1LCA4MzIwLCA4MzQ1LCA4MzcwLCA4Mzk1LCA4NDE5LCA4NDQ0LCA4NDY5LCA4NDk0LCA4NTE4LCA4NTQzLCA4NTY4LCA4NTkyLCA4NjE3LCA4NjQxLCA4NjY2LCA4NjkxLCA4NzE1LCA4NzQwLCA4NzY0LCA4Nzg5LCA4ODEzLCA4ODM3LCA4ODYyLCA4ODg2LCA4OTExLCA4OTM1LCA4OTU5LCA4OTg0LCA5MDA4LCA5MDMyLCA5MDU3LCA5MDgxLCA5MTA1LCA5MTI5LCA5MTU0LCA5MTc4LCA5MjAyLCA5MjI2LCA5MjUwLCA5Mjc0LCA5Mjk5LCA5MzIzLCA5MzQ3LCA5MzcxLCA5Mzk1LCA5NDE5LCA5NDQzLCA5NDY3LCA5NDkxLCA5NTE1LCA5NTM5LCA5NTYyLCA5NTg2LCA5NjEwLCA5NjM0LCA5NjU4LCA5NjgyLCA5NzA2LCA5NzI5LCA5NzUzLCA5Nzc3LCA5ODAxLCA5ODI0LCA5ODQ4LCA5ODcyLCA5ODk1LCA5OTE5LCA5OTQzLCA5OTY2LCA5OTkwLCAxMDAxMywgMTAwMzcsIDEwMDYxLCAxMDA4NCwgMTAxMDgsIDEwMTMxLCAxMDE1NSwgMTAxNzgsIDEwMjAyLCAxMDIyNSwgMTAyNDgsIDEwMjcyLCAxMDI5NSwgMTAzMTksIDEwMzQyLCAxMDM2NSwgMTAzODksIDEwNDEyLCAxMDQzNSwgMTA0NTgsIDEwNDgyLCAxMDUwNSwgMTA1MjgsIDEwNTUxLCAxMDU3NCwgMTA1OTgsIDEwNjIxLCAxMDY0NCwgMTA2NjcsIDEwNjkwLCAxMDcxMywgMTA3MzYsIDEwNzU5LCAxMDc4MiwgMTA4MDUsIDEwODI4LCAxMDg1MSwgMTA4NzQsIDEwODk3LCAxMDkyMCwgMTA5NDMsIDEwOTY2LCAxMDk4OSwgMTEwMTIsIDExMDM1LCAxMTA1OCwgMTEwODAsIDExMTAzLCAxMTEyNiwgMTExNDksIDExMTcxLCAxMTE5NCwgMTEyMTcsIDExMjQwLCAxMTI2MiwgMTEyODUsIDExMzA4LCAxMTMzMCwgMTEzNTMsIDExMzc2LCAxMTM5OCwgMTE0MjEsIDExNDQzLCAxMTQ2NiwgMTE0ODksIDExNTExLCAxMTUzNCwgMTE1NTYsIDExNTc5LCAxMTYwMSwgMTE2MjMsIDExNjQ2LCAxMTY2OCwgMTE2OTEsIDExNzEzLCAxMTczNSwgMTE3NTgsIDExNzgwLCAxMTgwMywgMTE4MjUsIDExODQ3LCAxMTg2OSwgMTE4OTIsIDExOTE0LCAxMTkzNiwgMTE5NTgsIDExOTgxLCAxMjAwMywgMTIwMjUsIDEyMDQ3LCAxMjA2OSwgMTIwOTEsIDEyMTE0LCAxMjEzNiwgMTIxNTgsIDEyMTgwLCAxMjIwMiwgMTIyMjQsIDEyMjQ2LCAxMjI2OCwgMTIyOTAsIDEyMzEyLCAxMjMzNCwgMTIzNTYsIDEyMzc4LCAxMjQwMCwgMTI0MjIsIDEyNDQ0LCAxMjQ2NSwgMTI0ODcsIDEyNTA5LCAxMjUzMSwgMTI1NTMsIDEyNTc1LCAxMjU5NiwgMTI2MTgsIDEyNjQwLCAxMjY2MiwgMTI2ODMsIDEyNzA1LCAxMjcyNywgMTI3NDksIDEyNzcwLCAxMjc5MiwgMTI4MTQsIDEyODM1LCAxMjg1NywgMTI4NzgsIDEyOTAwLCAxMjkyMiwgMTI5NDMsIDEyOTY1LCAxMjk4NiwgMTMwMDgsIDEzMDI5LCAxMzA1MSwgMTMwNzIsIDEzMDk0LCAxMzExNSwgMTMxMzcsIDEzMTU4LCAxMzE3OSwgMTMyMDEsIDEzMjIyLCAxMzI0NCwgMTMyNjUsIDEzMjg2LCAxMzMwOCwgMTMzMjksIDEzMzUwLCAxMzM3MiwgMTMzOTMsIDEzNDE0LCAxMzQzNSwgMTM0NTcsIDEzNDc4LCAxMzQ5OSwgMTM1MjAsIDEzNTQxLCAxMzU2MiwgMTM1ODQsIDEzNjA1LCAxMzYyNiwgMTM2NDcsIDEzNjY4LCAxMzY4OSwgMTM3MTAsIDEzNzMxLCAxMzc1MiwgMTM3NzMsIDEzNzk0LCAxMzgxNSwgMTM4MzYsIDEzODU3LCAxMzg3OCwgMTM4OTksIDEzOTIwLCAxMzk0MSwgMTM5NjIsIDEzOTgzLCAxNDAwNCwgMTQwMjUsIDE0MDQ1LCAxNDA2NiwgMTQwODcsIDE0MTA4LCAxNDEyOSwgMTQxNDksIDE0MTcwLCAxNDE5MSwgMTQyMTIsIDE0MjMyLCAxNDI1MywgMTQyNzQsIDE0Mjk1LCAxNDMxNSwgMTQzMzYsIDE0MzU3LCAxNDM3NywgMTQzOTgsIDE0NDE4LCAxNDQzOSwgMTQ0NjAsIDE0NDgwLCAxNDUwMSwgMTQ1MjEsIDE0NTQyLCAxNDU2MiwgMTQ1ODMsIDE0NjAzLCAxNDYyNCwgMTQ2NDQsIDE0NjY1LCAxNDY4NSwgMTQ3MDYsIDE0NzI2LCAxNDc0NywgMTQ3NjcsIDE0Nzg3LCAxNDgwOCwgMTQ4MjgsIDE0ODQ4LCAxNDg2OSwgMTQ4ODksIDE0OTA5LCAxNDkzMCwgMTQ5NTAsIDE0OTcwLCAxNDk5MSwgMTUwMTEsIDE1MDMxLCAxNTA1MSwgMTUwNzEsIDE1MDkyLCAxNTExMiwgMTUxMzIsIDE1MTUyLCAxNTE3MiwgMTUxOTIsIDE1MjEzLCAxNTIzMywgMTUyNTMsIDE1MjczLCAxNTI5MywgMTUzMTMsIDE1MzMzLCAxNTM1MywgMTUzNzMsIDE1MzkzLCAxNTQxMywgMTU0MzMsIDE1NDUzLCAxNTQ3MywgMTU0OTMsIDE1NTEzLCAxNTUzMywgMTU1NTMsIDE1NTczLCAxNTU5MywgMTU2MTIsIDE1NjMyLCAxNTY1MiwgMTU2NzIsIDE1NjkyLCAxNTcxMiwgMTU3MzEsIDE1NzUxLCAxNTc3MSwgMTU3OTEsIDE1ODExLCAxNTgzMCwgMTU4NTAsIDE1ODcwLCAxNTg4OSwgMTU5MDksIDE1OTI5LCAxNTk0OCwgMTU5NjgsIDE1OTg4LCAxNjAwNywgMTYwMjcsIDE2MDQ3LCAxNjA2NiwgMTYwODYsIDE2MTA1LCAxNjEyNSwgMTYxNDUsIDE2MTY0LCAxNjE4NCwgMTYyMDMsIDE2MjIzLCAxNjI0MiwgMTYyNjIsIDE2MjgxLCAxNjMwMSwgMTYzMjAsIDE2MzQwLCAxNjM1OSwgMTYzNzgsIDE2Mzk4LCAxNjQxNywgMTY0MzcsIDE2NDU2LCAxNjQ3NSwgMTY0OTUsIDE2NTE0LCAxNjUzMywgMTY1NTMsIDE2NTcyLCAxNjU5MSwgMTY2MTAsIDE2NjMwLCAxNjY0OSwgMTY2NjgsIDE2Njg3LCAxNjcwNywgMTY3MjYsIDE2NzQ1LCAxNjc2NCwgMTY3ODQsIDE2ODAzLCAxNjgyMiwgMTY4NDEsIDE2ODYwLCAxNjg3OSwgMTY4OTgsIDE2OTE3LCAxNjkzNywgMTY5NTYsIDE2OTc1LCAxNjk5NCwgMTcwMTMsIDE3MDMyLCAxNzA1MSwgMTcwNzAsIDE3MDg5LCAxNzEwOCwgMTcxMjcsIDE3MTQ2LCAxNzE2NSwgMTcxODQsIDE3MjAzLCAxNzIyMiwgMTcyNDAsIDE3MjU5LCAxNzI3OCwgMTcyOTcsIDE3MzE2LCAxNzMzNSwgMTczNTQsIDE3MzczLCAxNzM5MSwgMTc0MTAsIDE3NDI5LCAxNzQ0OCwgMTc0NjcsIDE3NDg1LCAxNzUwNCwgMTc1MjMsIDE3NTQyLCAxNzU2MCwgMTc1NzksIDE3NTk4LCAxNzYxNiwgMTc2MzUsIDE3NjU0LCAxNzY3MywgMTc2OTEsIDE3NzEwLCAxNzcyOCwgMTc3NDcsIDE3NzY2LCAxNzc4NCwgMTc4MDMsIDE3ODIxLCAxNzg0MCwgMTc4NTksIDE3ODc3LCAxNzg5NiwgMTc5MTQsIDE3OTMzLCAxNzk1MSwgMTc5NzAsIDE3OTg4LCAxODAwNywgMTgwMjUsIDE4MDQ0LCAxODA2MiwgMTgwODAsIDE4MDk5LCAxODExNywgMTgxMzYsIDE4MTU0LCAxODE3MywgMTgxOTEsIDE4MjA5LCAxODIyOCwgMTgyNDYsIDE4MjY0LCAxODI4MywgMTgzMDEsIDE4MzE5LCAxODMzNywgMTgzNTYsIDE4Mzc0LCAxODM5MiwgMTg0MTEsIDE4NDI5LCAxODQ0NywgMTg0NjUsIDE4NDgzLCAxODUwMiwgMTg1MjAsIDE4NTM4LCAxODU1NiwgMTg1NzQsIDE4NTkyLCAxODYxMSwgMTg2MjksIDE4NjQ3LCAxODY2NSwgMTg2ODMsIDE4NzAxLCAxODcxOSwgMTg3MzcsIDE4NzU1LCAxODc3MywgMTg3OTEsIDE4ODEwLCAxODgyOCwgMTg4NDYsIDE4ODY0LCAxODg4MiwgMTg5MDAsIDE4OTE3LCAxODkzNSwgMTg5NTMsIDE4OTcxLCAxODk4OSwgMTkwMDcsIDE5MDI1LCAxOTA0MywgMTkwNjEsIDE5MDc5LCAxOTA5NywgMTkxMTQsIDE5MTMyLCAxOTE1MCwgMTkxNjgsIDE5MTg2LCAxOTIwNCwgMTkyMjEsIDE5MjM5LCAxOTI1NywgMTkyNzUsIDE5MjkzLCAxOTMxMCwgMTkzMjgsIDE5MzQ2LCAxOTM2NCwgMTkzODEsIDE5Mzk5LCAxOTQxNywgMTk0MzQsIDE5NDUyLCAxOTQ3MCwgMTk0ODcsIDE5NTA1LCAxOTUyMywgMTk1NDAsIDE5NTU4LCAxOTU3NiwgMTk1OTMsIDE5NjExLCAxOTYyOCwgMTk2NDYsIDE5NjYzLCAxOTY4MSwgMTk2OTksIDE5NzE2LCAxOTczNCwgMTk3NTEsIDE5NzY5LCAxOTc4NiwgMTk4MDQsIDE5ODIxLCAxOTgzOSwgMTk4NTYsIDE5ODczLCAxOTg5MSwgMTk5MDgsIDE5OTI2LCAxOTk0MywgMTk5NjEsIDE5OTc4LCAxOTk5NSwgMjAwMTMsIDIwMDMwLCAyMDA0OCwgMjAwNjUsIDIwMDgyLCAyMDEwMCwgMjAxMTcsIDIwMTM0LCAyMDE1MSwgMjAxNjksIDIwMTg2LCAyMDIwMywgMjAyMjEsIDIwMjM4LCAyMDI1NSwgMjAyNzIsIDIwMjkwLCAyMDMwNywgMjAzMjQsIDIwMzQxLCAyMDM1OCwgMjAzNzYsIDIwMzkzLCAyMDQxMCwgMjA0MjcsIDIwNDQ0LCAyMDQ2MSwgMjA0NzksIDIwNDk2LCAyMDUxMywgMjA1MzAsIDIwNTQ3LCAyMDU2NCwgMjA1ODEsIDIwNTk4LCAyMDYxNSwgMjA2MzIsIDIwNjQ5LCAyMDY2NiwgMjA2ODMsIDIwNzAwLCAyMDcxNywgMjA3MzQsIDIwNzUxLCAyMDc2OCwgMjA3ODUsIDIwODAyLCAyMDgxOSwgMjA4MzYsIDIwODUzLCAyMDg3MCwgMjA4ODcsIDIwOTA0LCAyMDkyMSwgMjA5MzgsIDIwOTU1LCAyMDk3MiwgMjA5ODgsIDIxMDA1LCAyMTAyMiwgMjEwMzksIDIxMDU2LCAyMTA3MywgMjEwODksIDIxMTA2LCAyMTEyMywgMjExNDAsIDIxMTU3LCAyMTE3MywgMjExOTAsIDIxMjA3LCAyMTIyNCwgMjEyNDAsIDIxMjU3LCAyMTI3NCwgMjEyOTEsIDIxMzA3LCAyMTMyNCwgMjEzNDEsIDIxMzU3LCAyMTM3NCwgMjEzOTEsIDIxNDA3LCAyMTQyNCwgMjE0NDEsIDIxNDU3LCAyMTQ3NCwgMjE0OTEsIDIxNTA3LCAyMTUyNCwgMjE1NDAsIDIxNTU3LCAyMTU3MywgMjE1OTAsIDIxNjA3LCAyMTYyMywgMjE2NDAsIDIxNjU2LCAyMTY3MywgMjE2ODksIDIxNzA2LCAyMTcyMiwgMjE3MzksIDIxNzU1LCAyMTc3MiwgMjE3ODgsIDIxODA1LCAyMTgyMSwgMjE4MzcsIDIxODU0LCAyMTg3MCwgMjE4ODcsIDIxOTAzLCAyMTkyMCwgMjE5MzYsIDIxOTUyLCAyMTk2OSwgMjE5ODUsIDIyMDAxLCAyMjAxOCwgMjIwMzQsIDIyMDUwLCAyMjA2NywgMjIwODMsIDIyMDk5LCAyMjExNiwgMjIxMzIsIDIyMTQ4LCAyMjE2NCwgMjIxODEsIDIyMTk3LCAyMjIxMywgMjIyMjksIDIyMjQ2LCAyMjI2MiwgMjIyNzgsIDIyMjk0LCAyMjMxMSwgMjIzMjcsIDIyMzQzLCAyMjM1OSwgMjIzNzUsIDIyMzkxLCAyMjQwOCwgMjI0MjQsIDIyNDQwLCAyMjQ1NiwgMjI0NzIsIDIyNDg4LCAyMjUwNCwgMjI1MjAsIDIyNTM3LCAyMjU1MywgMjI1NjksIDIyNTg1LCAyMjYwMSwgMjI2MTcsIDIyNjMzLCAyMjY0OSwgMjI2NjUsIDIyNjgxLCAyMjY5N10sIHYsIHMsIEMsIEYsIFYsIGQsIGwsIGYsIEksIGgsIEcsIHAsIGcsIEUsIEEsIE4sIG8sIGMsIFAgPSBuZXcgQXJyYXkoKSwgVDsKZnVuY3Rpb24gcjEoKSB7CiAgRCgidmFkIGluaXQiKSwgbCA9IG5ldyBBcnJheSgpLCBoID0gbmV3IEFycmF5KCksIGcgPSBuZXcgQXJyYXkoKSwgRyA9IG5ldyBBcnJheSgpLCBlMSgpOwp9CmZ1bmN0aW9uIGUxKCkgewogIHAgPSAwLCBFID0gMCwgTiA9IDAsIHMgPSAwLCB2ID0gaS5FU1ZBRF9TSUxFTkNFLCBjID0gcGFyc2VJbnQoWiksIG8gPSAwLCBJID0gMCwgZiA9IDA7Cn0KZnVuY3Rpb24gTyhlLCByLCB0LCBuLCBhKSB7CiAgZm9yICh2YXIgXyA9IDA7IF8gPCBhOyApCiAgICBHW24gKyBfXSA9IGVbciArIF9dLCBfKys7Cn0KZnVuY3Rpb24gbjEoZSwgcikgewogIHZhciB0LCBuOwogIGlmIChEKCJjYWxsIEFwcGVuZERhdGEgZnVuY3Rpb24sIHBjbURhdGFMZW5ndGggOiAiICsgciArICIsIHBjbURhdGFbMF0gOiAiICsgZVswXSksIHIgPT0gMSkgewogICAgdmFyIGEgPSBJOwogICAgcmV0dXJuIGxbYV0gPSBlWzBdLCArK2EsIGEgPj0gUyAmJiAoYSAtPSBTKSwgYSA9PSBmID8gNyA6IChJID0gYSwgMCk7CiAgfQogIGlmICh0ID0gcGFyc2VJbnQoSSAtIGYpLCB0IDwgMCAmJiAodCArPSBTKSwgdCArPSByLCB0ID4gUyAtIDEpCiAgICByZXR1cm4gNzsKICBpZiAoSSArIHIgPCBTKSB7CiAgICBmb3IgKG4gPSAwOyBuIDwgcjsgbisrKQogICAgICBsW0kgKyBuXSA9IGVbbl07CiAgICBJICs9IHI7CiAgfSBlbHNlIHsKICAgIHZhciBfID0gUyAtIEk7CiAgICBmb3IgKF8gPSBTIC0gSSwgbiA9IDA7IG4gPCBfOyBuKyspCiAgICAgIGxbSSArIG5dID0gZVtuXTsKICAgIGZvciAobiA9IDA7IG4gPCByIC0gXzsgbisrKQogICAgICBsW25dID0gZVtfICsgbl07CiAgICBJID0gciAtIF87CiAgfQogIGZvciAoRCgiY2FsbCBBcHBlbmREYXRhIGZ1bmN0aW9uLCBtX2lQQ01FbmQgOiAiICsgSSk7IDsgKSB7CiAgICB2YXIgVSA9ICExOwogICAgaWYgKGkuRVNWQURfSU5BQ1RJVkUgIT0gdiAmJiAoVSA9IEUxKCksIFUpKSB7CiAgICAgIGlmIChnW3AgJSBNXSA9IHQxKCksIE8oaCwgMCwgRywgcCAlIHBhcnNlSW50KE0pICogcGFyc2VJbnQobSkgKiAyLCBwYXJzZUludChtKSAqIDIpLCBwKyssIHAgPCBwYXJzZUludChIKSkKICAgICAgICBjb250aW51ZTsKICAgICAgXzEoKTsKICAgIH0KICAgIGlmIChjIDwgbykgewogICAgICB7CiAgICAgICAgdmFyIEwgPSBuZXcgQXJyYXkoKTsKICAgICAgICBPKEcsIGMgJSBwYXJzZUludChNKSAqIHBhcnNlSW50KG0pICogMiwgTCwgMCwgcGFyc2VJbnQobSAqIDIpKSwgUFtQLmxlbmd0aF0gPSBMOwogICAgICB9CiAgICAgIGMrKzsKICAgIH0KICAgIGlmIChpLkVTVkFEX0lOQUNUSVZFID09IHYgJiYgYyA8IG8pIHsKICAgICAgewogICAgICAgIHZhciBMID0gbmV3IEFycmF5KCk7CiAgICAgICAgTyhHLCBjICUgcGFyc2VJbnQoTSkgKiBwYXJzZUludChtKSAqIDIsIEwsIDAsIHBhcnNlSW50KG0gKiAyKSksIFBbUC5sZW5ndGhdID0gTDsKICAgICAgfQogICAgICBjKys7CiAgICB9CiAgICBpZiAoIVUpCiAgICAgIGJyZWFrOwogIH0KICBkID0gMDsKICB2YXIgdyA9IDA7CiAgZm9yIChuID0gMDsgbiA8IHI7IG4rKykgewogICAgdmFyIGI7CiAgICBiID0gZVtuXSA+PiAyLCB3ICs9IGIgKiBiICsgOCA+PiA0OwogIH0KICByZXR1cm4gdyAvPSByLCB3IDwgMjU2ID8gZCA9IDAgOiAoZCA9IFIodywgNikgPj4gMjIsIGQgPiA5ICYmIChkID0gOSkpLCBEKCJ2YWQgdm9sdW1lIDogIiArIGQpLCBwb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICJ2b2x1bWUiLCBtZXNzYWdlOiBkIH0pLCAwOwp9CmZ1bmN0aW9uIFIoZSwgcikgewogIHZhciB0LCBuLCBhID0gcjsKICByZXR1cm4gKytlLCBlICYgNDI5NDkwMTc2MCB8fCAoZSA8PD0gMTYsIGEgKz0gMTYpLCBlICYgNDI3ODE5MDA4MCB8fCAoZSA8PD0gOCwgYSArPSA4KSwgZSAmIDQwMjY1MzE4NDAgfHwgKGUgPDw9IDQsIGEgKz0gNCksIGUgJiAzMjIxMjI1NDcyIHx8IChlIDw8PSAyLCBhICs9IDIpLCBlICYgMjE0NzQ4MzY0OCB8fCAoZSA8PD0gMSwgYSArPSAxKSwgZSA9IGUgLSAyMTQ3NDgzNjQ4LCBuID0gZSA+PiAyMSwgdCA9IGExW25dIDw8IDcsIHQgKz0gKDMxIC0gYSkgKiBwYXJzZUludChqKSwgdDsKfQpmdW5jdGlvbiB0MSgpIHsKICB2YXIgZSA9IDAsIHIsIHQ7CiAgZm9yIChyID0gMDsgciA8IHU7IHIrKykKICAgIGUgKz0gaFtyXTsKICBmb3IgKGUgPSBlIC8gcGFyc2VJbnQodSksIHQgPSAwLCByID0gMDsgciA8IHU7IHIrKykgewogICAgdmFyIG4sIGE7CiAgICBuID0gaFtyXSwgYSA9IG4gLSBlLCB0ICs9IGEgKiBhICsgMTI4ID4+IDg7CiAgfQogIHJldHVybiB0ID4+PSAyLCBNYXRoLm1heCg0MCwgdCk7Cn0KZnVuY3Rpb24gRTEoKSB7CiAgdmFyIGUgPSBwYXJzZUludChJIC0gZik7CiAgaWYgKGUgPCAwICYmIChlICs9IHBhcnNlSW50KFMpKSwgZSA8IHUpCiAgICByZXR1cm4gITE7CiAgaWYgKGYgKyB1IDw9IFMpIHsKICAgIGZvciAodmFyIHIgPSAwOyByIDwgdTsgcisrKQogICAgICBoW3JdID0gbFtmICsgcl07CiAgICBmICs9IG07CiAgfSBlbHNlIHsKICAgIHZhciB0ID0gUyAtIGYsIHI7CiAgICBmb3IgKHIgPSAwOyByIDwgdDsgcisrKQogICAgICBoW3JdID0gbFtmICsgcl07CiAgICBmb3IgKHIgPSAwOyByIDwgdSAtIHQ7IHIrKykKICAgICAgaFt0ICsgcl0gPSBsW3JdOwogICAgZiArPSBtLCBmID4gUyAmJiAoZiAtPSBTKTsKICB9CiAgcmV0dXJuICEwOwp9CmZ1bmN0aW9uIGsoZSwgciwgdCkgewogIGZvciAodmFyIG4gPSAwLCBhID0gMDsgbiA8IHQ7IG4rKykKICAgIGlmIChnWyhBICsgbikgJSBNXSA+IGUgPyBhKysgOiBhID0gMCwgYSA+IHIpCiAgICAgIHJldHVybiBBID0gbiArIEEgLSByLCAhMDsKICByZXR1cm4gITE7Cn0KZnVuY3Rpb24gXzEoKSB7CiAgdmFyIGUsIHIsIHQsIG4sIGEsIF87CiAgZm9yIChlID0gcCAtIEU7IGUgIT0gMDsgKSB7CiAgICBpZiAoZSA9IHAgLSBFLCBlID09IDApCiAgICAgIHJldHVybjsKICAgIGlmIChzID09IDApIHsKICAgICAgaWYgKGUgPCBIKQogICAgICAgIHJldHVybjsKICAgICAgaWYgKEUgPD0gdSAvIG0pIHsKICAgICAgICArK0U7CiAgICAgICAgY29udGludWU7CiAgICAgIH0KICAgICAgZm9yIChUID0gcGFyc2VJbnQoVyksIHMgPSAwLCB0ID0gMDsgdCA8IEg7IHQrKykKICAgICAgICBzICs9IGdbKEUgKyB0KSAlIE1dOwogICAgICBzIC89IHBhcnNlSW50KEgpLCBBID0gRSArIDEsIGEgPSBzICsgMjAwLCBDID0gcGFyc2VJbnQoYSAqIDIwIC8gKChSKGEsIDApICsgSyA+PiAxOCkgLSA2NCkpLCBDIDw8PSA1LCBDIC09IDIwMDsKICAgIH0KICAgIHN3aXRjaCAoRCgiY2hlY2sgdmFkIHN0YXRlIDogIiArIHYpLCB2KSB7CiAgICAgIGNhc2UgaS5FU1ZBRF9TSUxFTkNFOgogICAgICAgIGlmIChyID0gcGFyc2VJbnQocCAtIEEpLCByIDwgeCkKICAgICAgICAgIHJldHVybjsKICAgICAgICBpZiAoayhDLCBwYXJzZUludChKKSwgcGFyc2VJbnQoeCkpKSB7CiAgICAgICAgICBmb3IgKHQgPSBFICsgMTsgdCA8PSBBIC0gSDsgKyt0KSB7CiAgICAgICAgICAgIGZvciAoYSA9IDAsIG4gPSAwOyBuIDwgSDsgbisrKQogICAgICAgICAgICAgIGEgKz0gZ1sodCArIG4pICUgTV07CiAgICAgICAgICAgIGEgLz0gcGFyc2VJbnQoSCksIGEgPCBzICYmIChzID0gYSwgRSA9IHQpOwogICAgICAgICAgfQogICAgICAgICAgYSA9IHBhcnNlSW50KFIocywgMCkgKyBLID4+IDE0KSwgXyA9IChhIC0gMjMwNCkgKiAoYSAtIDIzMDQpID4+IDEyLCBfICs9IDUxMiwgRiA9IHMgKiAoNzIwIC8gMikgLyBfIDw8IDUsIE4gPSBBLCB2ID0gaS5FU1ZBRF9DSEVDS19CRUdJTjsKICAgICAgICB9IGVsc2UKICAgICAgICAgIHMgPSAwLCB2ID0gaS5FU1ZBRF9TSUxFTkNFLCBFKys7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgaS5FU1ZBRF9DSEVDS19CRUdJTjoKICAgICAgICBpZiAociA9IHBhcnNlSW50KHAgLSBBKSwgciA8IFEpCiAgICAgICAgICByZXR1cm47CiAgICAgICAgayhGLCBwYXJzZUludChZKSwgcGFyc2VJbnQoUSkpID8gKEUgPSBOLCBBID0gRSArIDEsIGMgPSBNYXRoLm1heChOIC0gcGFyc2VJbnQoJCksIHBhcnNlSW50KFopKSwgdiA9IGkuRVNWQURfQUNUSVZFLCBvID0gTWF0aC5taW4oTiArIHBhcnNlSW50KHkpLCBwKSwgViA9IDApIDogKHMgPSAwLCB2ID0gaS5FU1ZBRF9TSUxFTkNFLCBFKyspOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlIGkuRVNWQURfQUNUSVZFOgogICAgICAgIGEgPSBnW0UgJSBNXSwgYSA8IEMgPyAodiA9IGkuRVNWQURfQ0hFQ0tfRU5ELCBBID0gRSArIDEpIDogKFYgPSBNYXRoLm1heChWLCBhKSwgViA+IEYgKiBCICYmIChhID0gUihWIC8gQiwgLTEwKSA+PiAxNCwgYSAtPSAyMzA0LCBhID0gYSAqIGEgPj4gMTIsIGEgKz0gNTEyLCBhID0gViAvIChwYXJzZUludChCKSAqIDE2KSAqIGEgLyA3MjAsIGEgPSBSKGEsIC0xMCkgPj4gMTQsIGEgLT0gMjMwNCwgYSA9IGEgKiBhID4+IDEyLCBhICs9IDUxMiwgYSA9IFYgLyAocGFyc2VJbnQoQikgKiAxNikgKiBhIC8gNzIwLCBzID0gYSwgYSA9IHMgKyAyMDAsIEMgPSBhICogMjAgLyBwYXJzZUludCgoUihhLCAwKSArIEsgPj4gMTgpIC0gNjQpLCBDIDw8PSA1LCBDIC09IDIwMCwgYSA9IHBhcnNlSW50KFIocywgMCkgKyBLID4+IDE0KSwgXyA9IChhIC0gMjMwNCkgKiAoYSAtIDIzMDQpID4+IDEyLCBfICs9IDUxMiwgRiA9IHMgKiAoNzIwIC8gMikgLyBfIDw8IDUpLCBFKyspLCBvID0gTWF0aC5taW4oRSArIHBhcnNlSW50KHkpLCBwKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSBpLkVTVkFEX0NIRUNLX0VORDoKICAgICAgICBpZiAobyA9IE1hdGgubWluKEUgKyBwYXJzZUludCh5KSwgcCksIHIgPSBwIC0gQSwgciA8IFQpCiAgICAgICAgICByZXR1cm47CiAgICAgICAgaWYgKGsoRiwgcGFyc2VJbnQoWCksIFQpKQogICAgICAgICAgRCgibG9jYWwgdmFkIGNoZWNrIGVuZCEhISEiICsgayhGLCBwYXJzZUludChYKSwgVCkpLCBFKyssIHYgPSBpLkVTVkFEX0FDVElWRSwgVCA9IHBhcnNlSW50KFcpOwogICAgICAgIGVsc2UgewogICAgICAgICAgdiA9IGkuRVNWQURfSU5BQ1RJVkUsIEQoImxvY2FsIHZhZCBjaGVjayBlbmQhISEhIiksIHBvc3RNZXNzYWdlKHsgY29tbWFuZDogImVzdmFkIiwgbWVzc2FnZTogImVuZCIgfSksIEEgPSBFICsgMSwgcyA9IDAsIG8gLSBOIDwgeiArIHkgJiYgKE4gPSAwLCBvID0gMCwgdiA9IGkuRVNWQURfU0lMRU5DRSk7CiAgICAgICAgICByZXR1cm47CiAgICAgICAgfQogICAgICAgIGJyZWFrOwogICAgICBjYXNlIGkuRVNWQURfSU5BQ1RJVkU6CiAgICAgICAgcmV0dXJuOwogICAgfQogIH0KfQo=", z = (r) => Uint8Array.from(atob(r), (e) => e.charCodeAt(0)), S = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", z(m)], { type: "text/javascript;charset=utf-8" });
function U(r) {
  let e;
  try {
    if (e = S && (self.URL || self.webkitURL).createObjectURL(S), !e) throw "";
    const I = new Worker(e, {
      type: "module",
      name: r == null ? void 0 : r.name
    });
    return I.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), I;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + m,
      {
        type: "module",
        name: r == null ? void 0 : r.name
      }
    );
  }
}
function O(r) {
  (console.warn || console.log)(`[IVRecorder warn]: ${r}`);
}
function u(r, e, I) {
  function s(M, w, l) {
    for (let D = 0; D < l.length; D++)
      M.setUint8(w + D, l.charCodeAt(D));
  }
  function g(M, w, l) {
    for (let D = 0; D < l.length; D++, w += 2)
      M.setInt16(w, l[D], !0);
  }
  const C = 16, t = r.length * 2, i = new ArrayBuffer(44 + t), A = new DataView(i);
  let o = 0;
  return s(A, o, "RIFF"), o += 4, A.setUint32(o, 36 + t, !0), o += 4, s(A, o, "WAVE"), o += 4, s(A, o, "fmt "), o += 4, A.setUint32(o, 16, !0), o += 4, A.setUint16(o, 1, !0), o += 2, A.setUint16(o, e, !0), o += 2, A.setUint32(o, I, !0), o += 4, A.setUint32(o, I * e * (C / 8), !0), o += 4, A.setUint16(o, e * (C / 8), !0), o += 2, A.setUint16(o, C, !0), o += 2, s(A, o, "data"), o += 4, A.setUint32(o, t, !0), g(A, 44, new Int16Array(r)), A;
}
function y(r, e) {
  const I = new Float32Array(e);
  let s = 0;
  for (let g = 0; g < r.length; g++)
    I.set(r[g], s), s += r[g].length;
  return I;
}
function f(r) {
  const e = [
    328,
    421,
    541,
    695,
    893,
    1147,
    1473,
    1892,
    2430,
    3121,
    4007,
    5145,
    6607,
    8484,
    10893,
    13987,
    17959,
    23060,
    29609,
    38018,
    48814,
    62676,
    80476,
    103329,
    132673,
    170349,
    218724,
    280837,
    360589,
    462988,
    594466,
    763280,
    980034,
    1258341,
    1615680,
    2074495,
    2663603,
    3420004,
    4391204
  ], I = e.length + 1;
  return function(C) {
    const t = e.findIndex(function(i) {
      return i > C;
    });
    return t === -1 ? I : t;
  }(function(C) {
    if (C == null || C.byteLength <= 2)
      return 0;
    let t = 0;
    for (let A = 0; A < C.length; A++)
      t += C[A];
    t /= C.length;
    let i = 0;
    for (let A = 0; A < C.length; A++)
      i += parseInt(String(Math.pow(C[A] - t, 2))) >> 9;
    return i /= C.length, parseInt(String(i));
  }(r));
}
function b(r) {
  const e = new Blob([r], { type: "application/javascript" });
  return URL.createObjectURL(e);
}
const a = {
  SUCCESS: "success",
  CHECK_SUPPORT_ERROR: "褰撳墠鐜涓嶆敮鎸佸綍闊?",
  CHECK_PERMISSION_ERROR: "璇锋眰褰曢煶鏉冮檺澶辫触",
  CHECK_PERMISSION_TIMEOUT: "褰撳墠鐜鏃犳硶鑾峰彇鏉冮檺鎴栬幏鍙栨潈闄愯秴鏃?"
}, G = {
  useVAD: !1,
  useVVD: !1,
  permissionTimeout: 1e3 * 3,
  enableOffload: !1,
  offloadFlushThreshold: 3e3,
  enableAGC: !1,
  agcTargetLevel: 0.1,
  agcMaxGain: 10,
  echoCancellation: !0,
  noiseSuppression: !1,
  deviceId: "",
  mediaStream: null,
  enablePeaks: !1,
  peaksPerSecond: 100
}, c = {
  bufferSize: 4096,
  numChannels: 1,
  outputSampleRate: 32e3
}, N = "audio/pcm", h = "audio/wav", R = `/**
 * AudioWorkletProcessor - 录音数据采集
 *
 * 运行在音频线程，每次 process() 接收 128 样本（一个 render quantum），
 * 累积到 BUFFER_SIZE（4096）样本后通过 port.postMessage 发送到主线程。
 * 使用 Transferable 零拷贝传输。
 */
const BUFFER_SIZE = 4096

class RecorderWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this._buffer = new Float32Array(BUFFER_SIZE)
    this._writeIndex = 0
    this._active = true
    // 诊断计数（音频线程内部视角，用于区分：process 未被调用 / 输入为空 / 输入全零）
    this._stats = {
      processCalls: 0,      // process() 被调用总次数
      inactiveCalls: 0,     // _active=false 期间的调用次数
      emptyInputCalls: 0,   // inputs[0] 缺失或无声道的调用次数（源无数据帧）
      framesIn: 0,          // 实际收到的输入样本总数
      zeroFrames: 0,        // 全零（数字静音）输入样本总数
      quantumGapCalls: 0,   // 相邻两次 process 之间 currentFrame 跳变次数（渲染量子被跳过）
      quantumGapFrames: 0   // 跳变累计缺失的帧数
    }
    this._lastFrame = -1
    this._lastQuantumSize = 128
    this._lastStatsTime = -1

    this.port.onmessage = (e) => {
      const { command } = e.data
      if (command === 'stop') {
        this._flush()
        this._active = false
        this.port.postMessage({ command: 'stopped' })
      } else if (command === 'start') {
        this._buffer = new Float32Array(BUFFER_SIZE)
        this._writeIndex = 0
        this._active = true
      }
    }
  }

  /**
   * flush 剩余缓冲数据
   */
  _flush() {
    if (this._writeIndex > 0) {
      const chunk = this._buffer.slice(0, this._writeIndex)
      this.port.postMessage(
        { command: 'audioData', buffer: chunk.buffer, length: chunk.length },
        [chunk.buffer]
      )
      this._buffer = new Float32Array(BUFFER_SIZE)
      this._writeIndex = 0
    }
  }

  /**
   * @param {Float32Array[][]} inputs
   * @returns {boolean}
   */
  _postStatsIfDue() {
    // 约每 1 秒把内部计数发给主线程；currentTime/currentFrame 是音频线程全局量，
    // 它们停止推进 = 渲染线程停摆（输出设备侧），与"输入为空"是不同的故障层
    if (this._lastStatsTime >= 0 && currentTime - this._lastStatsTime < 1) return
    this._lastStatsTime = currentTime
    const s = this._stats
    this.port.postMessage({
      command: 'workletStats',
      stats: {
        processCalls: s.processCalls,
        inactiveCalls: s.inactiveCalls,
        emptyInputCalls: s.emptyInputCalls,
        framesIn: s.framesIn,
        zeroFrames: s.zeroFrames,
        quantumGapCalls: s.quantumGapCalls,
        quantumGapFrames: s.quantumGapFrames
      },
      currentFrame: currentFrame,
      currentTime: currentTime,
      sampleRate: sampleRate,
      quantumSize: this._lastQuantumSize,
      active: this._active
    })
  }

  process(inputs) {
    const stats = this._stats
    stats.processCalls++
    if (this._lastFrame >= 0) {
      const delta = currentFrame - this._lastFrame
      if (delta > this._lastQuantumSize) {
        stats.quantumGapCalls++
        stats.quantumGapFrames += delta - this._lastQuantumSize
      }
    }
    this._lastFrame = currentFrame
    this._postStatsIfDue()

    if (!this._active) {
      stats.inactiveCalls++
      return true
    }

    const input = inputs[0]
    if (!input || !input[0]) {
      stats.emptyInputCalls++
      return true
    }

    const channelData = input[0]
    this._lastQuantumSize = channelData.length || this._lastQuantumSize
    stats.framesIn += channelData.length
    let allZero = true
    for (let i = 0; i < channelData.length; i++) {
      if (channelData[i] !== 0) {
        allZero = false
        break
      }
    }
    if (allZero) stats.zeroFrames += channelData.length
    let offset = 0

    while (offset < channelData.length) {
      const remaining = BUFFER_SIZE - this._writeIndex
      const toCopy = Math.min(remaining, channelData.length - offset)
      this._buffer.set(channelData.subarray(offset, offset + toCopy), this._writeIndex)
      this._writeIndex += toCopy
      offset += toCopy

      if (this._writeIndex >= BUFFER_SIZE) {
        const chunk = this._buffer
        this.port.postMessage(
          { command: 'audioData', buffer: chunk.buffer, length: chunk.length },
          [chunk.buffer]
        )
        this._buffer = new Float32Array(BUFFER_SIZE)
        this._writeIndex = 0
      }
    }

    return true
  }
}

registerProcessor('recorder-worklet-processor', RecorderWorkletProcessor)
`;
class _ {
  constructor(e) {
    n(this, "_memBuffer", []);
    n(this, "_totalLength", 0);
    n(this, "_flushedCount", 0);
    n(this, "_flushThreshold");
    n(this, "_db", null);
    n(this, "_useIDB", !1);
    n(this, "_flushPromise", null);
    n(this, "_dbName");
    n(this, "_dbReady");
    this._flushThreshold = (e == null ? void 0 : e.flushThreshold) ?? 3e3, this._dbName = `iv-recorder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, this._dbReady = this._openDB();
  }
  async _openDB() {
    try {
      const e = await new Promise((I, s) => {
        const g = indexedDB.open(this._dbName, 1);
        g.onupgradeneeded = () => {
          const C = g.result;
          C.objectStoreNames.contains("chunks") || C.createObjectStore("chunks", { autoIncrement: !0 });
        }, g.onsuccess = () => I(g.result), g.onerror = () => s(g.error);
      });
      this._db = e, this._useIDB = !0;
    } catch {
      this._useIDB = !1;
    }
  }
  append(e, I) {
    this._memBuffer.push(e), this._totalLength += I, this._useIDB && this._memBuffer.length >= this._flushThreshold && this._flush();
  }
  _flush() {
    if (!this._db || this._memBuffer.length === 0 || this._flushPromise) return;
    const e = this._memBuffer;
    this._memBuffer = [], this._flushPromise = new Promise((I, s) => {
      const g = this._db.transaction("chunks", "readwrite"), C = g.objectStore("chunks");
      for (const t of e)
        C.put(t);
      g.oncomplete = () => {
        this._flushedCount += e.length, this._flushPromise = null, I();
      }, g.onerror = () => {
        this._memBuffer = e.concat(this._memBuffer), this._flushPromise = null, s(g.error);
      };
    });
  }
  async readAll() {
    return this._flushPromise && await this._flushPromise, !this._useIDB || !this._db || this._flushedCount === 0 ? { buffer: [...this._memBuffer], length: this._totalLength } : {
      buffer: (await new Promise((I, s) => {
        const C = this._db.transaction("chunks", "readonly").objectStore("chunks"), t = [], i = C.openCursor();
        i.onsuccess = () => {
          const A = i.result;
          A ? (t.push(A.value), A.continue()) : I(t);
        }, i.onerror = () => s(i.error);
      })).concat(this._memBuffer),
      length: this._totalLength
    };
  }
  async replaceAll(e, I) {
    this._flushPromise && await this._flushPromise, this._useIDB && this._db ? (await new Promise((s, g) => {
      const i = this._db.transaction("chunks", "readwrite").objectStore("chunks").clear();
      i.onsuccess = () => s(), i.onerror = () => g(i.error);
    }), await new Promise((s, g) => {
      const C = this._db.transaction("chunks", "readwrite"), t = C.objectStore("chunks");
      for (const i of e)
        t.put(i);
      C.oncomplete = () => {
        this._flushedCount = e.length, s();
      }, C.onerror = () => g(C.error);
    }), this._memBuffer = []) : this._memBuffer = e, this._totalLength = I;
  }
  async clear() {
    this._flushPromise && await this._flushPromise, this._useIDB && this._db && await new Promise((e, I) => {
      const C = this._db.transaction("chunks", "readwrite").objectStore("chunks").clear();
      C.onsuccess = () => e(), C.onerror = () => I(C.error);
    }), this._memBuffer = [], this._totalLength = 0, this._flushedCount = 0;
  }
  async dispose() {
    await this.clear(), this._db && (this._db.close(), this._db = null);
    try {
      await new Promise((e, I) => {
        const s = indexedDB.deleteDatabase(this._dbName);
        s.onsuccess = () => e(), s.onerror = () => I(s.error);
      });
    } catch {
    }
    this._useIDB = !1;
  }
  get length() {
    return this._totalLength;
  }
  get hasData() {
    return this._totalLength > 0;
  }
  get bufferCount() {
    return this._flushedCount + this._memBuffer.length;
  }
}
const j = 0.1, K = 0.1, Y = 0.05, Z = 1e-3;
class V {
  constructor(e) {
    n(this, "_EVENTS", {});
    n(this, "_AUDIO");
    n(this, "_resamplerAudio");
    n(this, "options");
    n(this, "recorderWorker", null);
    n(this, "vadWorker", null);
    n(this, "_workletModuleURL", null);
    n(this, "_audioStore", null);
    n(this, "_exportUrls", []);
    n(this, "_peaks", []);
    n(this, "_peakAccMin", 0);
    n(this, "_peakAccMax", 0);
    n(this, "_peakAccCount", 0);
    n(this, "_peakSamplesPerPeak", 0);
    n(this, "_pendingWorkerTasks", 0);
    n(this, "_pendingWorkerDrainResolvers", []);
    n(this, "_workletStopResolvers", []);
    this._init(e);
  }
  on(e, I) {
    this._EVENTS[e] === void 0 && (this._EVENTS[e] = []), this._EVENTS[e].push(I);
  }
  off(e, I) {
    const s = this._EVENTS[e];
    if (Array.isArray(s)) {
      for (let g = 0; g < s.length; g++)
        if (I === s[g]) {
          s.splice(g, 1);
          break;
        }
    }
  }
  trigger(e, ...I) {
    const s = this._EVENTS[e];
    if (Array.isArray(s))
      for (let g = 0; g < s.length; g++)
        s[g].apply(null, I);
  }
  _init(e) {
    this._EVENTS = {}, this._workletModuleURL = null, this._AUDIO = {
      recording: !1,
      paused: !1,
      context: null,
      stream: null,
      ownsStream: !1,
      node: {
        source: null,
        processorNode: null,
        useWorklet: !1
      },
      agc: {
        smoothedGain: 1
      }
    }, this._resamplerAudio = {
      buffer: [],
      length: 0
    }, this._exportUrls = [], this.options = Object.assign({}, G, e), this._peaks = [], this._peakAccMin = 0, this._peakAccMax = 0, this._peakAccCount = 0, this._pendingWorkerTasks = 0, this._pendingWorkerDrainResolvers = [], this._workletStopResolvers = [], this._peakSamplesPerPeak = c.outputSampleRate / (this.options.peaksPerSecond || 100), this.options.enableOffload ? this._audioStore = new _({
      flushThreshold: this.options.offloadFlushThreshold ?? 3e3
    }) : this._audioStore = null, this._createRecorderWorker(), this._compatibility(), this._initRecorderWorker(), this.options.useVAD && (this._createVadWorker(), this._initVadWorker());
  }
  _createRecorderWorker() {
    this.recorderWorker = new x();
  }
  _createVadWorker() {
    this.vadWorker = new U();
  }
  _compatibility() {
    const e = navigator;
    e.getUserMedia = e.getUserMedia || e.webkitGetUserMedia || e.mozGetUserMedia || e.msGetUserMedia;
    const I = window;
    I.AudioContext = I.AudioContext || I.webkitAudioContext || I.mozAudioContext || I.msAudioContext, I.URL = I.URL || I.webkitURL;
    const s = function(g) {
      return e.getUserMedia ? new Promise(function(C, t) {
        e.getUserMedia.call(e, g, C, t);
      }) : Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    };
    e.mediaDevices === void 0 && (e.mediaDevices = {}), e.mediaDevices.getUserMedia === void 0 && (e.mediaDevices.getUserMedia = s);
  }
  _initRecorderWorker() {
    this.recorderWorker.onerror = (e) => {
      this.trigger("error", { source: "recorderWorker", message: e.message, error: e });
    }, this.recorderWorker.onmessage = (e) => {
      if (!(!e.data || !e.data.command)) {
        if (e.data.command === "exportResamplerAudio") {
          this._saveResamplerAudio(e.data.data);
          return;
        }
        e.data.command === "audioProcessComplete" && this._markWorkerTaskCompleted();
      }
    };
  }
  _initVadWorker() {
    this.vadWorker.onerror = (e) => {
      this.trigger("error", { source: "vadWorker", message: e.message, error: e });
    }, this.vadWorker.postMessage({ command: "init" }), this.vadWorker.onmessage = (e) => {
      !e.data || !e.data.command || e.data.command === "esvad" && e.data.message === "end" && this._vadEnd();
    };
  }
  _saveResamplerAudio(e) {
    if (this.trigger("audioProcessPcmData", {
      data: e.buffer,
      length: e.length
    }), this._audioStore ? this._audioStore.append(e.buffer, e.length) : (this._resamplerAudio.buffer.push(e.buffer), this._resamplerAudio.length += e.length), this.options.enablePeaks && this._accumulatePeaks(e.buffer, e.length), this.options.useVVD && this._volumeDetection(e.buffer), this.options.useVAD && this.vadWorker) {
      const I = new Float32Array(e.buffer);
      this.vadWorker.postMessage(
        { command: "appendData", pcmData: I, nSamples: e.length },
        [I.buffer]
      );
    }
  }
  _markWorkerTaskQueued() {
    this._pendingWorkerTasks++;
  }
  _markWorkerTaskCompleted() {
    if (this._pendingWorkerTasks > 0 && this._pendingWorkerTasks--, this._pendingWorkerTasks === 0) {
      const e = this._pendingWorkerDrainResolvers.splice(0);
      for (const I of e)
        I();
    }
  }
  _waitForPendingWorkerTasks(e = 1500) {
    return this._pendingWorkerTasks === 0 ? Promise.resolve() : (console.log(
      "[IVRecorder] waiting recorder worker drain:",
      "pendingTasks=",
      this._pendingWorkerTasks,
      "timeoutMs=",
      e
    ), new Promise((I) => {
      let s = !1, g = null, C = !1;
      const t = () => {
        if (s) return;
        s = !0;
        const A = g ? this._pendingWorkerDrainResolvers.indexOf(g) : -1;
        A !== -1 && this._pendingWorkerDrainResolvers.splice(A, 1), console.log(
          "[IVRecorder] recorder worker drain finished:",
          "pendingTasks=",
          this._pendingWorkerTasks,
          "timeoutReached=",
          C
        ), I();
      }, i = setTimeout(() => {
        C = !0, t();
      }, e);
      g = () => {
        clearTimeout(i), t();
      }, this._pendingWorkerDrainResolvers.push(g);
    }));
  }
  _resolveWorkletStopped() {
    console.log(
      "[IVRecorder] recorder worklet stopped ack:",
      "pendingTasks=",
      this._pendingWorkerTasks
    );
    const e = this._workletStopResolvers.splice(0);
    for (const I of e)
      I();
  }
  _waitForWorkletStop(e = 500) {
    return !this._AUDIO.node.useWorklet || !this._AUDIO.node.processorNode ? Promise.resolve() : (console.log(
      "[IVRecorder] waiting recorder worklet stop:",
      "pendingTasks=",
      this._pendingWorkerTasks,
      "timeoutMs=",
      e
    ), new Promise((I) => {
      let s = !1, g = null, C = !1;
      const t = () => {
        if (s) return;
        s = !0;
        const A = g ? this._workletStopResolvers.indexOf(g) : -1;
        A !== -1 && this._workletStopResolvers.splice(A, 1), console.log(
          "[IVRecorder] recorder worklet stop finished:",
          "pendingTasks=",
          this._pendingWorkerTasks,
          "timeoutReached=",
          C
        ), I();
      }, i = setTimeout(() => {
        C = !0, t();
      }, e);
      g = () => {
        clearTimeout(i), t();
      }, this._workletStopResolvers.push(g);
    }));
  }
  async _waitForRecorderDrain(e = !1) {
    console.log(
      "[IVRecorder] wait recorder drain start:",
      "waitForWorkletStop=",
      e,
      "pendingTasks=",
      this._pendingWorkerTasks
    ), e ? await this._waitForWorkletStop() : await new Promise((I) => setTimeout(I, 0)), await this._waitForPendingWorkerTasks(), console.log(
      "[IVRecorder] wait recorder drain done:",
      "pendingTasks=",
      this._pendingWorkerTasks
    );
  }
  _volumeDetection(e) {
    const I = f(e);
    this.trigger("volumeChange", I);
  }
  _accumulatePeaks(e, I) {
    for (let s = 0; s < I; s++) {
      const g = e[s] / 32768;
      g < this._peakAccMin && (this._peakAccMin = g), g > this._peakAccMax && (this._peakAccMax = g), this._peakAccCount++, this._peakAccCount >= this._peakSamplesPerPeak && (this._peaks.push([this._peakAccMin, this._peakAccMax]), this._peakAccMin = 0, this._peakAccMax = 0, this._peakAccCount = 0, this.trigger("peaksChange", this._peaks));
    }
  }
  exportPeaks() {
    const e = [...this._peaks];
    this._peakAccCount > 0 && e.push([this._peakAccMin, this._peakAccMax]);
    const I = (this._audioStore ? this._audioStore.length : this._resamplerAudio.length) / c.outputSampleRate;
    return {
      peaks: e,
      length: e.length,
      duration: I,
      peaksPerSecond: this.options.peaksPerSecond || 100,
      sampleRate: c.outputSampleRate
    };
  }
  exportPeaksBinary() {
    const { peaks: e, duration: I, peaksPerSecond: s, sampleRate: g } = this.exportPeaks(), C = 20, t = e.length * 2 * 4, i = new ArrayBuffer(C + t), A = new DataView(i);
    A.setUint32(0, 1, !0), A.setUint32(4, s, !0), A.setUint32(8, g, !0), A.setUint32(12, e.length, !0), A.setFloat32(16, I, !0);
    const o = new Float32Array(i, C);
    for (let M = 0; M < e.length; M++)
      o[M * 2] = e[M][0], o[M * 2 + 1] = e[M][1];
    return i;
  }
  static parsePeaksBinary(e) {
    const I = new DataView(e), s = I.getUint32(0, !0);
    if (s !== 1)
      throw new Error(`Unsupported peaks binary version: ${s}`);
    const g = I.getUint32(4, !0), C = I.getUint32(8, !0), t = I.getUint32(12, !0), i = I.getFloat32(16, !0), A = new Float32Array(e, 20), o = [];
    for (let M = 0; M < t; M++)
      o.push([A[M * 2], A[M * 2 + 1]]);
    return { peaks: o, length: t, duration: i, peaksPerSecond: g, sampleRate: C };
  }
  _vadEnd() {
    return this.trigger("vadEnd"), this.stop();
  }
  _applyAGC(e) {
    if (!this.options.enableAGC || !this._AUDIO.agc) return;
    const I = this._AUDIO.agc, s = this.options.agcTargetLevel ?? 0.1, g = this.options.agcMaxGain ?? 10;
    let C = 0;
    for (let o = 0; o < e.length; o++)
      C += e[o] * e[o];
    const t = Math.sqrt(C / e.length);
    if (t < Z) return;
    const i = Math.max(j, Math.min(g, s / t)), A = i > I.smoothedGain ? K : Y;
    I.smoothedGain = I.smoothedGain * (1 - A) + i * A;
    for (let o = 0; o < e.length; o++)
      e[o] = Math.max(-1, Math.min(1, e[o] * I.smoothedGain));
  }
  _handleAudioBuffer(e) {
    if (!this._AUDIO.recording || this._AUDIO.paused)
      return;
    this._applyAGC(e);
    const I = new Float32Array(e);
    this._markWorkerTaskQueued(), this.recorderWorker.postMessage(
      { command: "audioProcess", buffer: I },
      [I.buffer]
    ), this.trigger("audioProcess", {
      inputBuffer: e,
      playbackTime: this._AUDIO.context ? this._AUDIO.context.currentTime : 0
    });
  }
  _syncRecorderWorkerConfig() {
    const e = this._AUDIO.context ? this._AUDIO.context.sampleRate : c.outputSampleRate;
    console.log(
      "[IVRecorder] sync recorder worker config:",
      "inputSampleRate=",
      e,
      "outputSampleRate=",
      c.outputSampleRate,
      "bufferSize=",
      c.bufferSize
    ), this.recorderWorker.postMessage({
      command: "init",
      config: {
        sampleRate: e,
        outputSampleRate: c.outputSampleRate,
        outputBufferLength: c.bufferSize,
        numChannels: c.numChannels,
        useVAD: this.options.useVAD,
        useVVD: this.options.useVVD
      }
    });
  }
  _getTrackSampleRate(e) {
    const I = e.getAudioTracks()[0], s = (I == null ? void 0 : I.getSettings().sampleRate) || c.outputSampleRate;
    return console.log(
      "[IVRecorder] track sample rate probe:",
      "trackSampleRate=",
      s,
      "settings=",
      I == null ? void 0 : I.getSettings()
    ), s;
  }
  async _teardownAudioGraph(e = !1) {
    if (this._AUDIO.node.source && (this._AUDIO.node.source.disconnect(), this._AUDIO.node.source = null), this._AUDIO.node.processorNode) {
      if (this._AUDIO.node.useWorklet) {
        const I = this._AUDIO.node.processorNode;
        I.port.postMessage({ command: "stop" }), I.port.close();
      }
      this._AUDIO.node.processorNode.disconnect(), this._AUDIO.node.processorNode = null;
    }
    this._AUDIO.node.useWorklet = !1, this._workletModuleURL && (URL.revokeObjectURL(this._workletModuleURL), this._workletModuleURL = null), e && this._AUDIO.context && (console.log("[IVRecorder] closing AudioContext:", this._AUDIO.context.sampleRate), await this._AUDIO.context.close().catch(() => {
    }), this._AUDIO.context = null);
  }
  async _setupAudioGraph(e, I) {
    const s = window;
    if (!this._AUDIO.context) {
      const t = I || c.outputSampleRate;
      console.log("[IVRecorder] create AudioContext with requested sampleRate:", t), this._AUDIO.context = new (s.AudioContext || AudioContext)({
        sampleRate: t
      });
    }
    typeof this._AUDIO.context.resume == "function" && await this._AUDIO.context.resume(), this._AUDIO.stream = e, this._AUDIO.node.source = this._AUDIO.context.createMediaStreamSource(e), await this._tryInitAudioWorklet() || this._initScriptProcessor();
    const C = this._AUDIO.context.sampleRate;
    return console.log(
      "[IVRecorder] audio graph ready:",
      "contextSampleRate=",
      C,
      "preferredSampleRate=",
      I,
      "useWorklet=",
      this._AUDIO.node.useWorklet
    ), C;
  }
  async _ensureAudioPipelineSampleRate(e) {
    const I = this._getTrackSampleRate(e), s = this._AUDIO.context ? this._AUDIO.context.sampleRate : 0, g = !this._AUDIO.context || !this._AUDIO.node.source || !this._AUDIO.node.processorNode || s !== I;
    if (console.log(
      "[IVRecorder] verify audio pipeline:",
      "trackSampleRate=",
      I,
      "contextSampleRate=",
      s,
      "hasSource=",
      !!this._AUDIO.node.source,
      "hasProcessor=",
      !!this._AUDIO.node.processorNode,
      "needsRebuild=",
      g
    ), g)
      return this._AUDIO.context ? console.warn(
        "[IVRecorder] sample rate mismatch or audio graph missing, rebuilding pipeline:",
        s,
        "->",
        I
      ) : console.log("[IVRecorder] AudioContext missing, creating fresh audio pipeline"), await this._teardownAudioGraph(!0), this._setupAudioGraph(e, I);
    const C = this._AUDIO.context;
    return C && typeof C.resume == "function" && await C.resume(), console.log("[IVRecorder] reuse existing audio pipeline:", s), s;
  }
  async _tryInitAudioWorklet() {
    try {
      const e = this._AUDIO.context;
      if (!e.audioWorklet)
        return !1;
      this._workletModuleURL = b(R), await e.audioWorklet.addModule(this._workletModuleURL);
      const I = new AudioWorkletNode(e, "recorder-worklet-processor");
      return I.port.onmessage = (s) => {
        if (s.data.command === "audioData") {
          const g = new Float32Array(s.data.buffer);
          this._handleAudioBuffer(g);
          return;
        }
        s.data.command === "stopped" && this._resolveWorkletStopped();
      }, this._AUDIO.node.source.connect(I), I.connect(e.destination), this._AUDIO.node.processorNode = I, this._AUDIO.node.useWorklet = !0, !0;
    } catch (e) {
      return console.warn("AudioWorklet 初始化失败，降级到 ScriptProcessor:", e), this._workletModuleURL && (URL.revokeObjectURL(this._workletModuleURL), this._workletModuleURL = null), !1;
    }
  }
  _initScriptProcessor() {
    const e = this._AUDIO.context, I = e.createScriptProcessor(c.bufferSize, 1, 1);
    I.onaudioprocess = (s) => {
      const g = s.inputBuffer.getChannelData(0);
      this._handleAudioBuffer(g);
    }, this._AUDIO.node.source.connect(I), I.connect(e.destination), this._AUDIO.node.processorNode = I, this._AUDIO.node.useWorklet = !1;
  }
  async _initMediaAudio() {
    const e = navigator;
    try {
      const constraints = {
        sampleRate: c.outputSampleRate,
        channelCount: 1,
        echoCancellation: this.options.echoCancellation !== !1,
        noiseSuppression: !!this.options.noiseSuppression,
        autoGainControl: !!this.options.enableAGC
      };
      this.options.deviceId && (constraints.deviceId = { exact: this.options.deviceId }), console.log("[IVRecorder] requested audio constraints:", constraints);
      let I = this.options.mediaStream;
      if (I) {
        if (typeof I.getAudioTracks != "function" || !I.getAudioTracks()[0])
          throw new Error("外部 MediaStream 没有可用音轨");
        this._AUDIO.ownsStream = !1, console.log("[IVRecorder] using shared MediaStream, track:", I.getAudioTracks()[0]);
      } else {
        I = await e.mediaDevices.getUserMedia({
          audio: constraints
        }), this._AUDIO.ownsStream = !0, console.log("[IVRecorder] getUserMedia success, track:", I.getAudioTracks()[0]);
      }
      const s = this._getTrackSampleRate(I), g = await this._setupAudioGraph(I, s);
      console.log(
        "[IVRecorder] initial sample rate check:",
        "contextSampleRate=",
        g,
        "trackSampleRate=",
        s,
        "matched=",
        g === s
      ), this._syncRecorderWorkerConfig(), this._AUDIO.recording = !0, console.log(
        "[IVRecorder] recording is active:",
        "contextTime=",
        this._AUDIO.context ? this._AUDIO.context.currentTime : 0,
        "sampleRate=",
        g
      );
    } catch (I) {
      throw O(`开始录音失败:${I.name ? I.name : I}`), I;
    }
  }
  _checkSupport() {
    return !!(window.navigator.mediaDevices && typeof window.navigator.mediaDevices.getUserMedia == "function" && typeof globalThis.AudioContext < "u" && typeof globalThis.URL < "u" && typeof globalThis.Worker < "u");
  }
  checkSupport() {
    return new Promise((e, I) => {
      this._checkSupport() ? e(a.SUCCESS) : I(new Error(a.CHECK_SUPPORT_ERROR));
    });
  }
  checkPermission() {
    return new Promise((e, I) => {
      setTimeout(() => {
        I(new Error(a.CHECK_PERMISSION_TIMEOUT));
      }, this.options.permissionTimeout), navigator.mediaDevices.getUserMedia({ audio: !0 }).then(
        (g) => {
          const C = g.getAudioTracks();
          for (let t = 0; t < C.length; t++)
            C[t].stop();
          e(a.SUCCESS);
        },
        (g) => {
          I(
            new Error(
              `${a.CHECK_PERMISSION_ERROR}:${g.name ? g.name : g}`
            )
          );
        }
      );
    });
  }
  reset() {
    return new Promise(async (e) => {
      this._AUDIO.agc && (this._AUDIO.agc.smoothedGain = 1), this._peaks = [], this._peakAccMin = 0, this._peakAccMax = 0, this._peakAccCount = 0, this._pendingWorkerTasks = 0, this._pendingWorkerDrainResolvers = [], this._workletStopResolvers = [], this._resamplerAudio = { buffer: [], length: 0 }, this._audioStore && await this._audioStore.clear(), this.recorderWorker && this._syncRecorderWorkerConfig(), e(a.SUCCESS);
    });
  }
  start() {
    return new Promise(async (e, I) => {
      if (!this._checkSupport()) {
        I(new Error(a.CHECK_SUPPORT_ERROR));
        return;
      }
      await this.reset(), this._AUDIO.paused = !1, this._AUDIO.stream ? (await this._ensureAudioPipelineSampleRate(this._AUDIO.stream), this._syncRecorderWorkerConfig(), this._AUDIO.node.useWorklet && this._AUDIO.node.processorNode && this._AUDIO.node.processorNode.port.postMessage({ command: "start" }), this._AUDIO.recording = !0, console.log(
        "[IVRecorder] recording resumed with existing pipeline:",
        "contextTime=",
        this._AUDIO.context ? this._AUDIO.context.currentTime : 0,
        "sampleRate=",
        this._AUDIO.context ? this._AUDIO.context.sampleRate : c.outputSampleRate
      )) : await this._initMediaAudio(), e(a.SUCCESS);
    });
  }
  pause() {
    return this._AUDIO.recording ? (this._AUDIO.paused = !0, a.SUCCESS) : a.SUCCESS;
  }
  resume() {
    return this._AUDIO.recording ? (this._AUDIO.paused = !1, a.SUCCESS) : a.SUCCESS;
  }
  stop() {
    return new Promise(async (e) => {
      console.log(
        "[IVRecorder] stop requested:",
        "useWorklet=",
        this._AUDIO.node.useWorklet,
        "pendingTasks=",
        this._pendingWorkerTasks,
        "contextTime=",
        this._AUDIO.context ? this._AUDIO.context.currentTime : 0
      ), this._AUDIO.recording = !1, this._AUDIO.paused = !1, this._AUDIO.node.useWorklet && this._AUDIO.node.processorNode ? (this._AUDIO.node.processorNode.port.postMessage({ command: "stop" }), await this._waitForRecorderDrain(!0)) : await this._waitForRecorderDrain(!1), console.log(
        "[IVRecorder] stop completed:",
        "pendingTasks=",
        this._pendingWorkerTasks
      ), e(a.SUCCESS);
    });
  }
  destroy() {
    return new Promise(async (e) => {
      this._AUDIO.recording = !1, this._AUDIO.paused = !1, this._resamplerAudio.buffer = [], this._resamplerAudio.length = 0, this._peaks = [];
      for (const I of this._exportUrls)
        URL.revokeObjectURL(I);
      if (this._exportUrls = [], this._audioStore && (await this._audioStore.dispose(), this._audioStore = null), this._AUDIO.stream && this._AUDIO.ownsStream) {
        const I = this._AUDIO.stream.getAudioTracks();
        for (let s = 0; s < I.length; s++)
          I[s].stop();
      }
      this._AUDIO.stream = null, this._AUDIO.ownsStream = !1;
      await this._teardownAudioGraph(!0), this.recorderWorker && (this.recorderWorker.terminate(), this.recorderWorker = null), this.vadWorker && (this.vadWorker.terminate(), this.vadWorker = null), e(a.SUCCESS);
    });
  }
  exportRawWAV() {
    return this._exportWAVFromSource();
  }
  exportPCM() {
    return this._export("PCM");
  }
  exportWAV() {
    return this._export("WAV");
  }
  exportPCMFile(e) {
    return this._exportFile("PCM", e);
  }
  exportWAVFile(e) {
    return this._exportFile("WAV", e);
  }
  async _readAudioData() {
    return this._audioStore ? this._audioStore.readAll() : this._resamplerAudio;
  }
  async _exportWAVFromSource() {
    await this.stop();
    const e = await this._readAudioData();
    if (e.buffer.length === 0 || e.length === 0)
      throw new Error("导出失败，没有录音数据");
    const I = e.length / c.outputSampleRate, s = e.buffer.reduce((o, M) => o + M.length, 0), g = Math.max(s, e.length);
    console.log("[IVRecorder exportRawWAV] 总采样数(length):", e.length, "实际buffer采样数:", s, "时长:", I, "秒", "WAV采样率:", c.outputSampleRate);
    const C = y(e.buffer, g), t = u(
      C,
      c.numChannels,
      c.outputSampleRate
    ), i = new Blob([t.buffer], { type: h }), A = URL.createObjectURL(i);
    return this._exportUrls.push(A), { audio: i, url: A, duration: I };
  }
  _export(e) {
    return new Promise(async (I, s) => {
      await this.stop();
      const g = await this._readAudioData();
      if (g.buffer.length === 0 || g.length === 0) {
        s(new Error("导出失败，没有录音数据"));
        return;
      }
      const C = g.length / c.outputSampleRate, t = g.buffer.reduce((l, D) => l + D.length, 0);
      if (console.log("[IVRecorder export" + e + "] 总采样数(length):", g.length, "实际buffer采样数:", t, "时长:", C, "秒", "WAV采样率:", c.outputSampleRate), e === "PCM") {
        I({
          audio: new Blob(g.buffer, { type: N }),
          duration: C
        });
        return;
      }
      const i = Math.max(t, g.length), A = y(g.buffer, i), o = u(
        A,
        c.numChannels,
        c.outputSampleRate
      ), M = new Blob([o.buffer], { type: h }), w = URL.createObjectURL(M);
      this._exportUrls.push(w), I({ audio: M, url: w, duration: C });
    });
  }
  _exportFile(e, I) {
    return new Promise(async (s, g) => {
      await this.stop();
      const C = await this._readAudioData();
      if (C.buffer.length === 0 || C.length === 0) {
        g(new Error("导出失败，没有录音数据"));
        return;
      }
      const t = C.length / c.outputSampleRate, i = C.buffer.reduce((d, L) => d + L.length, 0);
      if (console.log("[IVRecorder exportFile" + e + "] 总采样数(length):", C.length, "实际buffer采样数:", i, "时长:", t, "秒", "WAV采样率:", c.outputSampleRate), e === "PCM") {
        const d = new Blob(C.buffer, { type: N }), L = new File([d], I || "iv-recording.pcm", { type: N });
        s({ file: L, duration: t });
        return;
      }
      const A = Math.max(i, C.length), o = y(C.buffer, A), M = u(
        o,
        c.numChannels,
        c.outputSampleRate
      ), w = new Blob([M.buffer], { type: h }), l = new File([w], I || "iv-recording.wav", { type: h }), D = URL.createObjectURL(l);
      this._exportUrls.push(D), s({ file: l, url: D, duration: t });
    });
  }
  revokeExportUrl(e) {
    const I = this._exportUrls.indexOf(e);
    I !== -1 && this._exportUrls.splice(I, 1), URL.revokeObjectURL(e);
  }
}
export {
  V as IVRecorder,
  V as default
};
