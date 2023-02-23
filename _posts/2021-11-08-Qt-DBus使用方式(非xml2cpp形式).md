---
layout: post
title:  "Qt-DBus使用方式(非xml2cpp形式)"
date:   2021-11-08
author: ssk-wh
categories: C++
---

相信来到桌面组的都已经培训过关于Dbus服务的adapter和interface的用法，这里再补充一下不借助这种方式直接获取属性，调用其方法，关联其信号的方法：

# 准备工作：
后面会用到自定义类型，所以我们提前定义它，并实现其<<，>>操作符函数，最后要在使用之前在Qt的元类型系统和Qt D_Bus类型系统注册．以供DBus通讯体系自动识别并使用．
其实现如下：

```cpp
#include <QDBusMessage>
#include <QDBusArgument>

struct DisplayRect{
qint16 x;
qint16 y;
quint16 width;
quint16 height;

operator QRect() const
{
    return QRect(x, y, width, height);
}
};

Q_DECLARE_METATYPE(DisplayRect)

QDBusArgument &operator<<(QDBusArgument &argument, const DisplayRect &rect);
const QDBusArgument &operator>>(const QDBusArgument &argument, DisplayRect &rect);
QDebug operator<<(QDebug deg, const DisplayRect &rect);

QDBusArgument &operator<<(QDBusArgument &argument, const DisplayRect &rect)
{
    argument.beginStructure();
    argument << rect.x << rect.y << rect.width << rect.height;
    argument.endStructure();
    return argument;
}

const QDBusArgument &operator>>(const QDBusArgument &argument, DisplayRect &rect)
{
    argument.beginStructure();
    argument >> rect.x >> rect.y >> rect.width >> rect.height;
    argument.endStructure();
    return argument;
}

QDebug operator<<(QDebug deg, const DisplayRect &rect)
{
    qDebug() << "x:" << rect.x << "y:" << rect.y << "width:" << rect.width << "height:" << rect.height;

    return deg;
}
```


`qDBusRegisterMetaType<DisplayRect>();`进行注册
# 1 关联服务属性信号变化并解析当前值
```cpp
QDBusConnection::sessionBus().connect("com.deepin.dde.daemon.Dock",
                                          "/com/deepin/dde/daemon/Dock",
                                          "org.freedesktop.DBus.Properties",
                                          "PropertiesChanged",
                                          "sa{sv}as",
                                          this, SLOT(handleDBusSignal(QDBusMessage)));


void handleDBusSignal(const QDBusMessage &msg)
{
    QList<QVariant> arguments = msg.arguments();
    // 参数固定长度
    if (3 != arguments.count())
        return;
    // 返回的数据中,这一部分对应的是数据发送方的interfacename,可判断是否是自己需要的服务
    QString interfaceName = msg.arguments().at(0).toString();
    if (interfaceName != "com.deepin.dde.daemon.Dock")
        return;
    QVariantMap changedProps = qdbus_cast<QVariantMap>(arguments.at(1).value<QDBusArgument>());
    QStringList keys = changedProps.keys();
    foreach (const QString &prop, keys) {
        if (prop == "FrontendWindowRect") { // 'FrontendWindowRect'属性发生变化－－－自定义类型
            QVariant ret = changedProps[prop];
            QDBusArgument argu = ret.value<QDBusArgument>();
            DisplayRect rect;
            argu >> rect;
            qDebug() << rect;
        } else if (prop == "Position") { // 'Position'属性发生变化－－－原生类型
            qDebug() << "Position" << changedProps[prop].toInt();
            break;
        }
    }
}
```

# ２ 获取DBus服务的属性
## 2.1 原生类型
```cpp
//2_1\ 获取DBus服务的属性之原生类型
    QDBusInterface inter2_1("com.deepin.dde.daemon.Dock",
                            "/com/deepin/dde/daemon/Dock",
                            "com.deepin.dde.daemon.Dock",
                            QDBusConnection::sessionBus(), this);
    qDebug() << inter2_1.property("Position").toInt();
```
## 2.2 自定义类型
```cpp
   //2_2\ 获取DBus服务的属性之自定义类型
    QDBusInterface inter2_2("com.deepin.daemon.Display", "/com/deepin/daemon/Display", "org.freedesktop.DBus.Properties");
    QString interafce = "com.deepin.daemon.Display";
    QString arg1 = "PrimaryRect";
    QDBusMessage msg = inter2_2.call("Get", interafce, arg1);

    QVariant var = msg.arguments().first();
    QDBusVariant dbvFirst = var.value<QDBusVariant>();
    QVariant vFirst = dbvFirst.variant();
    QDBusArgument dbusArgs = vFirst.value<QDBusArgument>();

    DisplayRect rect;
    dbusArgs >> rect;
    qDebug() << rect;
```

# 3 调用DBus服务的方法
## 3.1 无返回值
```cpp
    //3_1\ 调用DBus服务的方法-无参调用-无返回值
    QDBusInterface inter3_1("com.deepin.dde.Clipboard",
                            "/com/deepin/dde/Clipboard",
                            "com.deepin.dde.Clipboard",
                            QDBusConnection::sessionBus(), this);
    inter3_1.call("Toggle");
```

## 3.2 有返回值
```cpp
    //3_2\ 调用DBus服务的方法-无参调用-有返回值
    QDBusInterface inter3_2("com.deepin.daemon.Network",
                            "/com/deepin/daemon/Network",
                            "com.deepin.daemon.Network",
                            QDBusConnection::sessionBus(), this);
    QDBusMessage msg3_2 = inter3_2.call("GetProxyIgnoreHosts");
    qDebug() << msg3_2.arguments().first().toString();
```

## 3.3 带参调用
```cpp
    //3_3\ 调用DBus服务的方法-带参调用
    QDBusInterface inter3_3("com.deepin.deepinid.Client",
                            "/com/deepin/deepinid/Client",
                            "com.deepin.deepinid.Client",
                            QDBusConnection::sessionBus(), this);
inter3_3.call("Authorize", QString("clientID"), QStringList("list"), QString("callback"), QString("state"));
```

# 4 通过qdbus命令行查看属性值
// 获取Display服务的PrimartRect属性内容
`qdbus --literal  com.deepin.daemon.Display /com/deepin/daemon/Display com.deepin.daemon.Display.PrimaryRect`

// 获取dock的geometry属性内容
`qdbus --literal  com.deepin.dde.Dock /com/deepin/dde/Dock com.deepin.dde.Dock.geometry`

# 5 通过dbus-send命令调用服务的方法
// 调用方法[传参]dbus-send支持的参数类型包括：string | int16 | uint16 | int32 | uint32 | int64 | uint64 | double | byte | boolean | objpath
`dbus-send --session --print-reply --dest=com.deepin.daemon.Network /com/deepin/daemon/Network com.deepin.daemon.Network.DisconnectDevice string:/org/freedesktop/NetworkManager/Devices/2`

# 6 通过dbus-monitor监听DBus信息流

![](https://github.com/ssk-wh/ssk-wh.github.io/raw/master/_posts/images/dbus/image.png)
// 监听服务情况,可得知消息触发源,但监听不到属性被调用
`dbus-monitor --session interface=org.freedesktop.Notifications `

// 监听信号变化
`dbus-monitor --session "type='signal',interface='org.freedesktop.DBus.Properties',path='/com/deepin/dde/daemon/Dock'"`





