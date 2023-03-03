---
layout: post
title:  "StatusNotifierItem(状态通知规范)"
date:   2023-02-28
author: ssk-wh
categories: freedesktop
---

<strong>目录</strong>
{:toc} 

## 原文链接

https://www.freedesktop.org/wiki/Specifications/StatusNotifierItem/



## 介绍

该规范定义了视觉项目的管理，通常是用于向用户报告应用程序状态或提供对该应用程序执行的常见操作的快速访问的图标。 它旨在补充但与 freedesktop 的桌面通知规范没有直接关系，旨在替代 freedesktop 系统托盘规范，更加面向模型视图，为工作空间提供更多自由，在图形方面更贴近它的视觉风格语言。



此规范未定义通知项的方面，这完全是特定于实现(状态通知)的。



![image.png](https://github.com/ssk-wh/ssk-wh.github.io/raw/master/_posts/images/status_notifier_item/image.png)



### 示例用例将包括：

混音器音量控制。

电池指示器。

即时通讯在线状态。

通用应用程序信息和操作，如媒体播放器控件。



## 基本设计

Status Notifier Item系统依赖于通过D-BUS的进程间通信，由三部分组成：

StatusNotifierItem:  每个想要使用系统状态通知机制的应用程序都应将自己的 StatusNotifierItem 注册到会话总线。

StatusNotifierWatcher: 用于跟踪 StatusNotifierItem 的每个活动实例的服务，StatusNotifierHost 使用它来获取所有状态通知实例的列表。它还会在添加和删除状态通知实例时发出通知。

StatusNotifierHost: 想要实现 StatusNotifierItem 实例可视化的应用程序必须在会话总线中注册一个 StatusNotifierHost。



## StatusNotifierItem

每个应用程序都可以通过在会话总线上注册服务 org.freedesktop.StatusNotifierItem-PID-ID 来注册任意数量的 Status Notifier Items，其中 PID 是应用程序的进程 ID，ID 是通过同一个应用程序注册的不同实例之间的任意数字的唯一标识符。

一旦创建了 StatusNotifierItem 的新实例，应用程序必须将唯一的实例名称注册到 StatusNotifierWatcher，见 StatusNotifierWatcher 章节。



### 属性

#### org.freedesktop.StatusNotifierItem.Category

STRING org.freedesktop.StatusNotifierItem.Category ();

描述此项目的类别。

Category 属性的允许值为：

| Category          | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| ApplicationStatus | 该项目描述了通用应用程序的状态，例如媒体播放器的当前状态。在无法知道项目类别的情况下，例如当项目被另一个不兼容或模拟的系统代理时，ApplicationStatus 可以用作合理的默认fallack。 |
| Communications    | 该项目描述了面向通信的应用程序的状态，例如即时消息程序或电子邮件客户端。 |
| SystemServices    | 该项目描述了系统的服务，用户没有将其视为独立的应用程序，例如磁盘索引服务活动的指示器。 |
| Hardware          | 该项目描述了特定硬件的状态和控制，例如电池充电指示器或声卡音量控制。 |



#### org.freedesktop.StatusNotifierItem.Id

STRING org.freedesktop.StatusNotifierItem.Id ();



对于这个应用程序来说,它应该是一个唯一的并且在会话之间保持一致的名称，例如应用程序名称本身。



#### org.freedesktop.StatusNotifierItem.Title

STRING org.freedesktop.StatusNotifierItem.Title ();



它是描述应用程序的名称，它可以比 Id 更具描述性。



#### org.freedesktop.StatusNotifierItem.Status

STRING org.freedesktop.StatusNotifierItem.Status ();



描述此项或相关应用程序的状态。

Status 属性的允许值为：

| Status         | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| Passive        | 该项目不会向用户传达重要信息，它可以被视为“空闲”状态，并且可视化图形可能会选择隐藏它。 |
| Active         | 该项目处于活动状态，更重要的是该项目将以某种方式显示给用户。 |
| NeedsAttention | 该项目携带对用户来说非常重要的信息，例如电池电量即将耗尽，并希望激励用户直接干预。可视化应该以某种方式强调(例如图标闪烁)具有 NeedsAttention 状态的项目。 |



#### org.freedesktop.StatusNotifierItem.WindowId

UINT32 org.freedesktop.StatusNotifierItem.WindowId ();



它是窗口的依赖于窗口系统的标识符，应用程序可以通过此属性选择其窗口之一可用，或者如果它不感兴趣则设置为 0。



#### org.freedesktop.StatusNotifierItem.IconName

STRING org.freedesktop.StatusNotifierItem.IconName ();



StatusNotifierItem 可以带有一个图标，可视化可以使用该图标来标识项目。



一个图标可以通过其符合 Freedesktop 的图标名称来标识，由该属性携带，或者由图标数据本身，也可由属性 IconPixmap 携带。如果两者都可用，可视化更喜欢图标名称而不是图标像素图（FIXME：目前不是很明确：如果找不到图标名称的话，是否可以将像素图用作fallback？）



#### org.freedesktop.StatusNotifierItem.IconPixmap

ARRAY(INT, INT, ARRAY BYTE) org.freedesktop.StatusNotifierItem.IconPixmap ();



携带图标的 ARGB32 二进制表示，本规范中使用的图标数据格式在**图标**章节中进行描述



#### org.freedesktop.StatusNotifierItem.OverlayIconName

STRING org.freedesktop.StatusNotifierItem.OverlayIconName ();



被Freedesktop 兼容的图标名称。这可以被可视化用来指示额外的状态信息，例如作为主图标的叠加。



#### org.freedesktop.StatusNotifierItem.OverlayIconPixmap

ARRAY(INT, INT, ARRAY BYTE) org.freedesktop.StatusNotifierItem.OverlayIconPixmap ();



上一段中描述的叠加图标的 ARGB32 二进制的表示。



#### org.freedesktop.StatusNotifierItem.AttentionIconName

STRING org.freedesktop.StatusNotifierItem.AttentionIconName ();



图标的 Freedesktop 兼容名称。可视化可以使用它来指示该项目处于 RequestingAttention 状态。



#### org.freedesktop.StatusNotifierItem.AttentionIconPixmap

ARRAY(INT, INT, ARRAY BYTE) org.freedesktop.StatusNotifierItem.AttentionIconPixmap ();



上一段中描述的请求注意图标的 ARGB32 二进制表示。



#### org.freedesktop.StatusNotifierItem.AttentionMovieName

STRING org.freedesktop.StatusNotifierItem.AttentionMovieName ();



项目还可以指定与 RequestingAttention 状态关联的动画。这应该是一个被 freedesktop 兼容的图标名称或完整路径。可视化可以自行决定在此属性和 AttentionIconPixmap 之间进行选择（或两者都不使用）。



#### org.freedesktop.StatusNotifierItem.ToolTip

(STRING, ARRAY(INT, INT, ARRAY BYTE), STRING, STRING) org.freedesktop.StatusNotifierItem.ToolTip ();



描述与此项目关联的额外信息的数据结构，可以通过工具提示（或任何其他可视化认为合适的方式）进行可视化。参数的意义分别是：

STRING: 图标名称(被freedesktop兼容的)

ARRAY(INT, INT, ARRAY BYTE): 图标数据

STRING: 提示的标题

STRING: 此工具提示的描述性文本。它还可以包含 HTML 标记语言的子集，有关允许的标记列表，请参阅节**标记**。



#### org.freedesktop.StatusNotifierItem.ItemIsMenu

BOOL: 该项目仅支持上下文菜单，可视化应该更喜欢显示菜单或发送 ContextMenu() 而不是 Activate()



#### org.freedesktop.StatusNotifierItem.Menu

OBJECT PATH: 应该实现 com.canonical.dbusmenu 接口的对象的 DBus 路径



### 方法

#### ContextMenu

VOID org.freedesktop.StatusNotifierItem.ContextMenu (INT x, INT y);



要求状态通知器项目显示上下文菜单，这通常是用户输入的结果，例如鼠标右键单击项目的图形表示。

x 和 y 参数是在当前屏幕的被点击的坐标，被用来提示菜单应该在何处显示。



#### Activate

VOID org.freedesktop.StatusNotifierItem.Activate (INT x, INT y);



要求激活状态通知器项目，这通常是用户输入的结果，例如鼠标左键单击项目的图形表示。应用程序将执行任何被认为适当的任务作为激活请求。

x 和 y 参数是在当前屏幕的被点击的坐标，被认为对显示最终窗口（如果有）会有帮助。



#### SecondaryActivate

VOID org.freedesktop.StatusNotifierItem.SecondaryActivate (INT x, INT y);



与 Activate 相比，被认为是次要且次要的激活形式。这通常是用户输入的结果，例如在项目的图形表示上单击鼠标中键。应用程序将执行任何被认为适当的任务作为激活请求。

x 和 y 参数是在当前屏幕的被点击的坐标，被认为对显示最终窗口（如果有）会有帮助。



#### Scroll

VOID org.freedesktop.StatusNotifierItem.Scroll (INT delta, STRING orientation);



用户要求滚动操作。这是由输入引起的，例如鼠标滚轮在项目的图形表示上。

delta参数代表滚动量，orientation参数代表滚动请求的水平或垂直方向，其合法值为horizontal和vertical。

#### 

### 信号

#### NewTitle

VOID org.freedesktop.StatusNotifierItem.NewTitle ();



该项目有一个新标题：图形表示应立即更新此值。



#### NewIcon

VOID org.freedesktop.StatusNotifierItem.NewIcon ();



该项目有一个新图标：图形表示应立即更新此值。



#### NewAttentionIcon

VOID org.freedesktop.StatusNotifierItem.NewAttentionIcon ();



该项目有一个新的关注图标：图形表示应立即更新此值。



#### NewOverlayIcon

VOID org.freedesktop.StatusNotifierItem.NewOverlayIcon ();



该项目有一个新的叠加图标：图形表示应立即更新此值。



#### NewToolTip

VOID org.freedesktop.StatusNotifierItem.NewToolTip ();



该项目有一个新的提示信息：图形表示应立即更新此值。



#### NewStatus

VOID org.freedesktop.StatusNotifierItem.NewStatus (STRING status);



该项目有一个新的状态：图形表示应立即更新此值。



## StatusNotifierWatcher

任意时间都将有且只有一个 org.freedesktop.StatusNotifierWatcher 服务实例在会话中被注册。 此服务用于跟踪 StatusNotifierItem 实例，枚举它们并在注册新实例或取消注册旧的实例时发出通知。



它还用于跟踪 org.freedesktop.StatusNotifierHost 实例，以便有一种简单的方法来了解是否至少有一个服务被注册用于StatusNotifierItem的可视化工作(即显示这些状态通知图标)。



### 方法

#### RegisterStatusNotifierItem

VOID org.freedesktop.StatusNotifierWatcher.RegisterStatusNotifierItem (STRING service);



将 StatusNotifierItem 以其在会话总线上的全名形式注册到 StatusNotifierWatcher 中，例如 org.freedesktop.StatusNotifierItem-4077-1。 StatusNotifierItem 实例必须注册到观察者(Watcher服务)，以便被观察者和 StatusNotifierHost 实例注意到。 如果注册的 StatusNotifierItem 离开会话总线，StatusNotifierWatcher 应该自动注意到它并将其从注册服务列表中删除。



#### RegisterStatusNotifierHost

VOID org.freedesktop.StatusNotifierWatcher.RegisterStatusNotifierHost (STRING service);



将 StatusNotifierHost 注册到 StatusNotifierWatcher 中，以其在会话总线上的全名形式，例如 org.freedesktop.StatusNotifierHost-4005。 每个打算显示 StatusNotifierItem 内容的 NotficationHost 实例都应该使用此方法注册到 StatusNotifierWatcher。 当每个 StatusNotifierHost 消失时，StatusNotifierWatcher 应该自动通知。



### 属性

#### RegisteredStatusNotifierItems

ARRAY(STRING) org.freedesktop.StatusNotifierWatcher.RegisteredStatusNotifierItems ();



包含 StatusNotifierItem 的所有已注册实例的列表。数组的所有元素都应对应于方法调用时会话总线上实际运行的服务。



#### IsStatusNotifierHostRegistered

BOOL org.freedesktop.StatusNotifierWatcher.IsStatusNotifierHostRegistered ();



如果至少有一个 StatusNotifierHost 已向名为 RegisterStatusNotifierHost 的部分注册并且当前正在运行，则为真。如果没有注册和运行 StatusNotifierHost，则所有 StatusNotifierItem 实例都应使用 Freedesktop 系统托盘规范作为替代实现。



#### ProtocolVersion

INT org.freedesktop.StatusNotifierWatcher.ProtocolVersion ();



StatusNotifierWatcher 实例实现的协议版本。



### 信号

#### StatusNotifierItemRegistered

BOOL org.freedesktop.StatusNotifierWatcher.StatusNotifierItemRegistered (STRING service);



一个新的 StatusNotifierItem服务被注册了，信号的参数是实例的会话总线名称。 StatusNotifierHost 实现应该监听此信号以了解他们何时应该更新状态通知信息。



#### StatusNotifierItemUnregistered

BOOL org.freedesktop.StatusNotifierWatcher.StatusNotifierItemUnregistered (STRING service);



同上面的信号，当一个已经注册的StatusNotifierItem服务取消注册时发出。



#### StatusNotifierHostRegistered

BOOL org.freedesktop.StatusNotifierWatcher.StatusNotifierHostRegistered ();



已注册新的 StatusNotifierHost，StatusNotifierItem 实例知道它们可以使用此协议而不是 freedesktop 系统托盘协议。







## StatusNotifierHost

StatusNotifierHost 是对应的应用程序中的一个对象，该对象负责注册的 StatusNotifierItem 实例的实际图形显示。



此服务的实例在 Dbus 会话总线上注册，名称为 org.freedesktop.StatusNotifierHost-id，其中 id 是唯一标识符，它使名称在总线上保持唯一，例如应用程序的进程 ID。如果同一进程注册了多个 StatusNotifierHost，则为另一种类型的标识符。

StatusNotifierHost 实例不需要任何特定的属性、方法或信号注册到总线。重要的是服务在总线上的存在，以通知 StatusNotifierWatcher当前有一个应用程序在负责 StatusNotifierItem 在图形层面的显示。



## 标记

工具提示的子文本可能包含标记。标记是基于 XML 的，由 XHTML 的一小部分组成。

StatusNotifierHost 可视化应支持以下标签。虽然它是可选的，但它是推荐的。不支持这些标签的 StatusNotifierHost 应该将它们过滤掉。

| tags                      | Description |
| ------------------------- | ----------- |
| `<b> ... </b>`            | 加粗        |
| `<i> ... </i>`            | 斜体        |
| `<u> ... </u>`            | 下划线      |
| `<a href="..."> ... </a>` | 超链接      |



图像可以与绝对路径名一起用作图像源。 alt 标签是强制性的。

本规范不需要完整的 HTML 实现，并且通知永远不应利用上面未列出的标签。 由于工具提示不能替代复杂的对话框，因此不需要高级布局，并且实际上可能会由于内存使用和屏幕空间而限制该系统可以运行的数量。 此类示例包括 PDA、某些手机和内存不足的慢速 PC 或掌上电脑。



## 图标

所有图标都可以通过其数据的特定序列化在总线上传输，能够表示同一图像的多种分辨率或相同尺寸图像的简短瞄准。

图标在签名为 a(iiay) 的原始图像数据结构数组中传输，每个图标分别描述宽度、高度和图像数据。数据以 ARGB32 格式表示，并采用网络字节顺序，以便于小端和大端机器之间的网络通信。

出于同样的原因，使用 XSLT 或 CSS 样式表的完整 XML 或 XHTML 实现不是本规范的一部分。必须以更复杂的形式呈现的信息应该使用特定于应用程序的对话框、Web 浏览器或其他一些显示机制。

上面指定的标签标记内容的方式允许它们在某些实现中被剥离而不影响实际内容。
