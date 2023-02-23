---
layout: post
title:  "Accessbility可访问性指导文档"
date:   2022-12-09
author: ssk-wh
categories: C++
---

> 如果你只想知道代码中如何尽快添加accessible辅助功能,请移步第四章

# 名词介绍
Accessbility:
可访问性。计算机软件的可访问性使应用程序可适用于具有不同能力(这是指听障，视障之类)的人。重要的是要考虑到不同人的需求，例如，在视力、听力、灵活性或认知问题的情况下。用户界面使用特别选择的颜色和高对比度的字体，从而支持屏幕阅读器和盲文显示器等辅助工具。

a11y:
类似于i18n,是ACCESSIBILITY的缩写。

# 第一章 关于标记的几点约束
1、统信当前的AT自动化只覆盖到图形控件层面，继承自QWidget的类如果需要被自动化脚本识别，都需要添加Accessibility的Name属性
2、可访问控件的标记名称,应该是唯一不变的，避免脚本无法识别

# 第二章 接口Factory函数实现

## 2.1 安装AccessibleFactory函数
当实现窗口小部件的可访问性接口时，通常会继承QAccessibleWidget，这是窗口小部件的便捷类。 另一个可用的便利类是QAccessibleObject，它实现了QObjects接口的一部分(当前的AT脚本只覆盖图形控件，暂时不用考虑QAccessibleObject)。
在main函数中安装工厂函数，当通过atspi访问小部件时，将会自动通过此函数指针获取对应控件的信息。
```cpp
QAccessible::installFactory(accessibleFactory);
```

`accessibleFactory`实现如下：
```cpp
#include <QAccessible>
#include <QAccessibleWidget>
#include <QMap>
#include <QObject>
#include <QMetaEnum>
#include <QWidget>

inline QString getAccessibleName(QWidget *w, QAccessible::Role r, const QString &fallback)
{
#define SEPARATOR "_"
    const QString lowerFallback = fallback.toLower();
    // 避免重复生成
    static QMap<QObject *, QString > objnameMap;
    if (!objnameMap[w].isEmpty())
        return objnameMap[w];

    static QMap< QAccessible::Role, QList< QString > > accessibleMap;
    QString oldAccessName = w->accessibleName().toLower();
    oldAccessName.replace(SEPARATOR, "");

    // 按照类型添加固定前缀
    QMetaEnum metaEnum = QMetaEnum::fromType<QAccessible::Role>();
    QByteArray prefix = metaEnum.valueToKeys(r);
    switch (r) {
    case QAccessible::Button:       prefix = "Btn";         break;
    case QAccessible::StaticText:   prefix = "Label";       break;
    default:                        break;
    }

    // 再加上标识
    QString accessibleName = QString::fromLatin1(prefix) + SEPARATOR;
    QString objectName = w->objectName().toLower();
    accessibleName += oldAccessName.isEmpty() ? (objectName.isEmpty() ?lowerFallback : objectName) : oldAccessName;
    // 检查名称是否唯一
    if (accessibleMap[r].contains(accessibleName)) {
        if (!objnameMap.key(accessibleName)) {
            objnameMap.remove(objnameMap.key(accessibleName));
            objnameMap.insert(w, accessibleName);
            return accessibleName;
        }
        // 获取编号，然后+1
        int pos = accessibleName.indexOf(SEPARATOR);
        int id = accessibleName.mid(pos + 1).toInt();

        QString newAccessibleName;
        do {
            // 一直找到一个不重复的名字
            newAccessibleName = accessibleName + SEPARATOR + QString::number(++id);
        } while (accessibleMap[r].contains(newAccessibleName));

        accessibleMap[r].append(newAccessibleName);
        objnameMap.insert(w, newAccessibleName);

        // 对象销毁后移除占用名称
        QObject::connect(w, &QWidget::destroyed, [ = ] (QObject *obj) {
            objnameMap.remove(obj);
            accessibleMap[r].removeOne(newAccessibleName);
        });
        return newAccessibleName;
    } else {
        accessibleMap[r].append(accessibleName);
        objnameMap.insert(w, accessibleName);

        // 对象销毁后移除占用名称
        QObject::connect(w, &QWidget::destroyed, [ = ] (QObject *obj) {
            objnameMap.remove(obj);
            accessibleMap[r].removeOne(accessibleName);
        });
        return accessibleName;
    }
}

class Accessible : public QAccessibleWidget {
public:
    Accessible(QWidget *parent, QAccessible::Role r, const QString &accessibleName)
        : QAccessibleWidget(parent, r)
        , data(qobject_cast<QWidget *>(parent))
        , accessibleName(accessibleName)
    {}

    // 对于使用dogtail的AT自动化测试工作，实际上只需要使用我们提供的text方法获取控件唯一ID,，然后再通过QAccessibleWidget的rect方法找到其坐标，模拟点击即可
    // rect没必要重新实现，text方法通过getAccessibleName确定返回唯一值
    QString text(QAccessible::Text t) const override {
        switch (t) {
        case QAccessible::Name:
            return getAccessibleName(data, this->role(), accessibleName);
        default:
            return QString();
        }
    }

private:
    QWidget *data;
    QString accessibleName;
};

QAccessibleInterface *accessibleFactory(const QString &classname, QObject *object)
{
    Q_UNUSED(classname);

    if (object->isWidgetType())
        return new Accessible(qobject_cast<QWidget *>(object), QAccessible::Role::Form), object->metaObject()->className());

    return nullptr;
}

```

附：
Accessible传入的parent必须继承自QWidget，QAccessible::Role代表了标记控件的类型，根据其实际功能，大致有按钮、纯文本等不同的类型，详见Qt帮助文档中对QAccessible::Role的介绍。


## 2.2 使用sniff命令查看是否成功标记对应控件
安装python-dopgtail组件

`sudo apt install python-dogtail`

在终端输入sniff命令

![](https://github.com/ssk-wh/ssk-wh.github.io/raw/master/_posts/images/accessbility/1.png)

在打开的AT_SPI Browser中,可以查看电脑上所有应用控件的标记情况
下图红框部分就是text()函数给出的字符了
<img src="https://github.com/ssk-wh/ssk-wh.github.io/raw/master/_posts/images/accessbility/2.png" style="zoom:50%;" />
在自动化测试过程中，标记到的控件，其属性Name需要确定一个唯一值且保持恒定不变，也就是代码中的text函数中的QAccessible::Name枚举对应的值

对于一些控件，有时候想直接调用应用提供的一些方法，可以通过重载QAccessibleActionInterface::actionNames()和QAccessibleActionInterface::doAction方法实现。

# 第三章 插件模式

继承QAccessiblePlugin，实现对应插件，和第二章区别不大。感兴趣可以看[官方文档](https://doc.qt.io/qt-6/qaccessibleplugin.html)。

# 第四章 实战演练

## 4.1 添加快捷宏定义

在项目中添加以下文件accessible.h
```cpp
// SPDX-FileCopyrightText: 2022 UnionTech Software Technology Co., Ltd.
//
// SPDX-License-Identifier: LGPL-3.0-or-later

#include <QAccessible>
#include <QAccessibleWidget>
#include <QMap>
#include <QObject>
#include <QMetaEnum>
#include <QWidget>

inline QString getAccessibleName(QWidget *w, QAccessible::Role r, const QString &fallback)
{
#define SEPARATOR "_"
    const QString lowerFallback = fallback.toLower();
    // 避免重复生成
    static QMap<QObject *, QString > objnameMap;
    if (!objnameMap[w].isEmpty())
        return objnameMap[w];

    static QMap< QAccessible::Role, QList< QString > > accessibleMap;
    QString oldAccessName = w->accessibleName().toLower();
    oldAccessName.replace(SEPARATOR, "");

    // 按照类型添加固定前缀
    QMetaEnum metaEnum = QMetaEnum::fromType<QAccessible::Role>();
    QByteArray prefix = metaEnum.valueToKeys(r);
    switch (r) {
    case QAccessible::Button:       prefix = "Btn";         break;
    case QAccessible::StaticText:   prefix = "Label";       break;
    default:                        break;
    }

    // 再加上标识
    QString accessibleName = QString::fromLatin1(prefix) + SEPARATOR;
    QString objectName = w->objectName().toLower();
    accessibleName += oldAccessName.isEmpty() ? (objectName.isEmpty() ?lowerFallback : objectName) : oldAccessName;
    // 检查名称是否唯一
    if (accessibleMap[r].contains(accessibleName)) {
        if (!objnameMap.key(accessibleName)) {
            objnameMap.remove(objnameMap.key(accessibleName));
            objnameMap.insert(w, accessibleName);
            return accessibleName;
        }
        // 获取编号，然后+1
        int pos = accessibleName.indexOf(SEPARATOR);
        int id = accessibleName.mid(pos + 1).toInt();

        QString newAccessibleName;
        do {
            // 一直找到一个不重复的名字
            newAccessibleName = accessibleName + SEPARATOR + QString::number(++id);
        } while (accessibleMap[r].contains(newAccessibleName));

        accessibleMap[r].append(newAccessibleName);
        objnameMap.insert(w, newAccessibleName);

        // 对象销毁后移除占用名称
        QObject::connect(w, &QWidget::destroyed, [ = ] (QObject *obj) {
            objnameMap.remove(obj);
            accessibleMap[r].removeOne(newAccessibleName);
        });
        return newAccessibleName;
    } else {
        accessibleMap[r].append(accessibleName);
        objnameMap.insert(w, accessibleName);

        // 对象销毁后移除占用名称
        QObject::connect(w, &QWidget::destroyed, [ = ] (QObject *obj) {
            objnameMap.remove(obj);
            accessibleMap[r].removeOne(accessibleName);
        });
        return accessibleName;
    }
}

class Accessible : public QAccessibleWidget {
public:
    Accessible(QWidget *parent, QAccessible::Role r, const QString &accessibleName)
        : QAccessibleWidget(parent, r)
        , data(qobject_cast<QWidget *>(parent))
        , accessibleName(accessibleName)
    {}

    // 对于使用dogtail的AT自动化测试工作，实际上只需要使用我们提供的text方法获取控件唯一ID,，然后再通过QAccessibleWidget的rect方法找到其坐标，模拟点击即可
    // rect没必要重新实现，text方法通过getAccessibleName确定返回唯一值
    QString text(QAccessible::Text t) const override {
        switch (t) {
        case QAccessible::Name:
            return getAccessibleName(data, this->role(), accessibleName);
        default:
            return QString();
        }
    }

private:
    QWidget *data;
    QString accessibleName;
};

QAccessibleInterface *accessibleFactory(const QString &classname, QObject *object)
{
    Q_UNUSED(classname);

    static QMap<QString, QAccessible::Role> s_roleMap = {
        {"MainWindow",                      QAccessible::Role::Form}
        , {"MainPanelControl",              QAccessible::Role::Button}
        , {"Dock::TipsWidget",              QAccessible::Role::StaticText}
        , {"DockPopupWindow",               QAccessible::Role::Form}
        , {"LauncherItem",                  QAccessible::Role::Button}
        , {"AppItem",                       QAccessible::Role::Button}
        , {"PreviewContainer",              QAccessible::Role::Button}
        , {"PluginsItem",                   QAccessible::Role::Button}
        , {"TrayPluginItem",                QAccessible::Role::Button}
        , {"PlaceholderItem",               QAccessible::Role::Button}
        , {"AppDragWidget",                 QAccessible::Role::Button}
        , {"AppSnapshot",                   QAccessible::Role::Button}
        , {"FloatingPreview",               QAccessible::Role::Button}
        , {"XEmbedTrayWidget",              QAccessible::Role::Button}
        , {"IndicatorTrayWidget",           QAccessible::Role::Button}
        , {"SNITrayWidget",                 QAccessible::Role::Button}
        , {"AbstractTrayWidget",            QAccessible::Role::Button}
        , {"SystemTrayItem",                QAccessible::Role::Button}
        , {"FashionTrayItem",               QAccessible::Role::Form}
        , {"FashionTrayWidgetWrapper",      QAccessible::Role::Form}
        , {"FashionTrayControlWidget",      QAccessible::Role::Button}
        , {"AttentionContainer",            QAccessible::Role::Form}
        , {"HoldContainer",                 QAccessible::Role::Form}
        , {"NormalContainer",               QAccessible::Role::Form}
        , {"SpliterAnimated",               QAccessible::Role::Form}
        , {"DatetimeWidget",                QAccessible::Role::Form}
        , {"OnboardItem",                   QAccessible::Role::Form}
        , {"TrashWidget",                   QAccessible::Role::Form}
        , {"PopupControlWidget",            QAccessible::Role::Button}
        , {"ShutdownWidget",                QAccessible::Role::Form}
        , {"MultitaskingWidget",            QAccessible::Role::Form}
        , {"ShowDesktopWidget",             QAccessible::Role::Form}
        , {"OverlayWarningWidget",          QAccessible::Role::Form}
        , {"QWidget",                       QAccessible::Role::Form}
        , {"QLabel",                        QAccessible::Role::StaticText}
        , {"Dtk::Widget::DIconButton",      QAccessible::Role::Button}
        , {"Dtk::Widget::DSwitchButton",    QAccessible::Role::Button}
        , {"DesktopWidget",                 QAccessible::Role::Button}
        , {"HorizontalSeperator",           QAccessible::Role::Form}
    };

    static QMap<QString, QString> s_classNameMap = {
        {"Dock::TipsWidget", "tips"}
        , {"DatetimeWidget","plugin-datetime"}
        , {"OnboardItem","plugin-onboard"}
        , {"TrashWidget","plugin-trash"}
        , {"ShutdownWidget","plugin-shutdown"}
        , {"MultitaskingWidget","plugin-multitasking"}
        , {"ShowDesktopWidget","plugin-showdesktop"}
        , {"OverlayWarningWidget","plugin-overlaywarningwidget"}
        , {"SoundItem", "plugin-sounditem"}
    };

    if (object->isWidgetType())
        return new Accessible(qobject_cast<QWidget *>(object)
                                       , s_roleMap.value(classname, QAccessible::Role::Form)
                                       , s_classNameMap.value(object->metaObject()->className(), object->metaObject()->className()));

    return nullptr;
}

```


## 4.2 启用自定义工厂函数
然后在QApplication构建之后,添加如下代码即可
```cpp
#include "accessible.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    ...

    // 自动化标记由此开始
    QAccessible::installFactory(accessibleFactory);

        ...
}
    
```
# 第五章 通过python实现AT自动化测试

## 5.1 安装

ps:请确保您有一定的python基础.
安装dogtail模块
`pip3 install dogtail`

## 5.2 获取应用的'可接入'名称

通过sniff命令打开AT_SPI Browser程序，找到你要测试的进程，这里以dde-dock进程为例：
<img src="https://github.com/ssk-wh/ssk-wh.github.io/raw/master/_posts/images/accessbility/3.png" style="zoom:50%;" />
选中dde-dock选项，在页面底部的Basic标签中，可以看到其Name为dde-dock,这也就是我们后续写AT测试脚本会用到的应用名。

## 5.3 脚本实战

使用dogtail需要导入root
`from dogtail.tree import root`
```python
#! /usr/bin/python3
# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

from dogtail.tree import root

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    print('show or hide launcher by dde-dock')
    root.application('dde-dock').child('Btn_launcheritem').click(button=1)

    print('open dde-control-center')
    root.application('dde-launcher').child('Form_settingsbtn').click(button=1)

    print('jump to update')
    dde_control_center=root.application('dde-control-center')
    dde_control_center.child('Editable_searchmodulelineedit').click(button=1)
    dde_control_center.child('Editable_searchmodulelineedit').typeText("电源")

# See PyCharm help at https://www.jetbrains.com/help/pycharm/

```
这是一个简单的脚本,点击任务栏的启动器,打开启动器，然后点击启动器界面上的设置按钮，打开控制中心，在控制中心的搜索栏中输入"电源"两个字。

大致分三步：
1、获取应用对象：通过root的application方法获取到指定应用，获取失败则抛出异常(简化考虑，并未处理此种情况)
2、查找控件：通过child方法，传入控件的accessibleName即可标记到对应控件
3、执行操作：通过click方法，传入对应的点击类型(1、2、3分别代表鼠标的左、中、右键)。模拟鼠标点击的情况

注：使用Python专用IDE:PyCharm，可以很好的完成代码提示、编码格式、源码跳转、包管理等功能。网络上有免费的社区版本。

# 附录

> 分享交流之用，如有侵权，告知必删。

[QAccessible Class](https://doc.qt.io/qt-6/qaccessible.html)

[QAccessibleInterface Class](https://doc.qt.io/qt-6/qaccessibleinterface.html)

[Accessibility for QWidget Applications](https://doc.qt.io/qt-6/accessible-qwidget.html)

[What is accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/What_is_accessibility)



