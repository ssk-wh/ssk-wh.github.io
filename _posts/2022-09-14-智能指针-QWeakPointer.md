---
layout: post
title:  "智能指针-QWeakPointer"
date:   2022-09-14
author: ssk-wh
categories: C++
---

# QWeakPointer
先介绍QWeakPointer，是因为QPointer和QSharedPointer的实现都依赖于QWeakPointer

## 作用
**1、为QPointer和QSharedPointer提供了弱引用计数的功能.**
**2、解除循环引用**

QWeakPointer 类持有对共享指针的弱引用。
QWeakPointer 是对 C++ 中指针的自动弱引用。**它不能用于直接取消引用指针，但可以用于验证指针是否已在另一个上下文中被删除**。
QWeakPointer 对象**只能通过 QSharedPointer 的赋值来创建**(因为没有重载operator*和->)。
需要注意的是，QWeakPointer 没有提供自动转换操作符来防止错误发生。即使 QWeakPointer 跟踪一个指针，它本身也不应该被认为是一个指针，因为它不能保证指向的对象保持有效。
因此，要访问 QWeakPointer 正在跟踪的指针，您必须首先将其提升为 QSharedPointer 并验证结果对象是否为空。 QSharedPointer 保证对象不被删除，所以如果你得到一个非空对象，你可以使用指针。有关示例，请参见 QWeakPointer::toStrongRef()。
QWeakPointer 还提供了 QWeakPointer::data() 方法，该方法返回跟踪的指针而不确保它保持有效。如果您可以通过外部方式保证对象不会被删除（或者如果您只需要指针值）那你就可以使用它。友情提示：使用 toStrongRef() 创建 QSharedPointer 的成本较高。

## 构造函数
观察QWeakPointer的构造函数部分，处于public部分的构造函数有如下几个，可以看出都是不允许带参构造或者参数并不是我们期望的指针类型.(所以，QWeakPointer从设计上就不是直接提供给我们使用的)
```cpp
// 无参构造
inline QWeakPointer() Q_DECL_NOTHROW : d(nullptr), value(nullptr) { }

// 拷贝构造,弱引用计数+1
QWeakPointer(const QWeakPointer &other) Q_DECL_NOTHROW : d(other.d), value(other.value)
    { if (d) d->weakref.ref(); }

// 拷贝构造,弱引用计数+1
inline QWeakPointer(const QSharedPointer<T> &o) : d(o.d), value(o.data())
    { if (d) d->weakref.ref();}

template <class X>
inline QWeakPointer(const QWeakPointer<X> &o) : d(nullptr), value(nullptr)
    { *this = o; }

template <class X>
inline QWeakPointer(const QSharedPointer<X> &o) : d(nullptr), value(nullptr)
    { *this = o; }
```

唯一的可用的构造函数处于private部分，好处是这里添加了两个友元类型QPointer和QSharedPointer，关于友元我们应该不用多做介绍(我是你的朋友，你的就是我的，但你不是我的朋友，所以我的还是我的^_^)
```cpp
private:

#if defined(Q_NO_TEMPLATE_FRIENDS)
public:
#else
    template <class X> friend class QSharedPointer;
    template <class X> friend class QPointer;
#endif

    template <class X>
    inline QWeakPointer &assign(X *ptr)
    { return *this = QWeakPointer<X>(ptr, true); }

#ifndef QT_NO_QOBJECT
    // 私有构造函数
    template <class X>
    inline QWeakPointer(X *ptr, bool) : d(ptr ? Data::getAndRef(ptr) : nullptr), value(ptr)
    { }
#endif

    inline void internalSet(Data *o, T *actual)
    {
        if (d == o) return;
        if (o)
            o->weakref.ref();
        if (d && !d->weakref.deref())
            delete d;
        d = o;
        value = actual;
    }

    // 唯二的成员变量
    Data *d;
    T *value;
};
```

QWeakPointer的数据成员只有两个，分别用于在私有构造函数中，ptr为模板参数类型的指针，d=ptr ? Data::getAndRef(ptr) : nullptr;
```cpp
typedef QtSharedPointer::ExternalRefCountData Data;
```

看下ExternalRefCountData的定义，从名字大概看出来这是一个关于引用计数的结构，用于保存引用计数相关的数据。
注意下这里的weakref和strongref都是QBasicAtomicInt类型的，关于**QAtom系列**的几个类，有时间会单独列一章。
```cpp
    struct ExternalRefCountData
    {
        typedef void (*DestroyerFn)(ExternalRefCountData *);
        QBasicAtomicInt weakref;
        QBasicAtomicInt strongref;
        DestroyerFn destroyer;

        inline ExternalRefCountData(DestroyerFn d)
            : destroyer(d)
        {
            strongref.store(1);
            weakref.store(1);
        }
        inline ExternalRefCountData(Qt::Initialization) { }
        ~ExternalRefCountData() { Q_ASSERT(!weakref.load()); Q_ASSERT(strongref.load() <= 0); }

        void destroy() { destroyer(this); }

#ifndef QT_NO_QOBJECT
        Q_CORE_EXPORT static ExternalRefCountData *getAndRef(const QObject *);
        Q_CORE_EXPORT void setQObjectShared(const QObject *, bool enable);
        Q_CORE_EXPORT void checkQObjectShared(const QObject *);
#endif
        inline void checkQObjectShared(...) { }
        inline void setQObjectShared(...) { }

        inline void operator delete(void *ptr) { ::operator delete(ptr); }
        inline void operator delete(void *, void *) { }
    };
```

QWeakPointer的带参构造函数是私有的，引用计数结构体使用getAndRef方法获取，value保存ptr。getAndRef只接受QObject*作为参数，因此就限制了QWeakPointer私有构造时，传入的指针类型必须为QObject.
从下面的代码我们不难发现QObjectPrivate中保存了一个ExternalRefCountData的指针，此指针存在时，引用计数+1。不存在时，创建一个新的指针，并赋值引用计数(强引用为-1,弱引用为2,这个数字回头再说)后，返回此指针。
```cpp
QtSharedPointer::ExternalRefCountData *QtSharedPointer::ExternalRefCountData::getAndRef(const QObject *obj)
{
    Q_ASSERT(obj);
    QObjectPrivate *d = QObjectPrivate::get(const_cast<QObject *>(obj));
    Q_ASSERT_X(!d->wasDeleted, "QWeakPointer", "Detected QWeakPointer creation in a QObject being deleted");

    ExternalRefCountData *that = d->sharedRefcount.load();
    if (that) {
        that->weakref.ref();
        return that;
    }

    // we can create the refcount data because it doesn't exist
    ExternalRefCountData *x = new ExternalRefCountData(Qt::Uninitialized);
    x->strongref.store(-1);
    x->weakref.store(2);  // the QWeakPointer that called us plus the QObject itself
    if (!d->sharedRefcount.testAndSetRelease(0, x)) {
        // ~ExternalRefCountData has a Q_ASSERT, so we use this trick to
        // only execute this if Q_ASSERTs are enabled
        Q_ASSERT((x->weakref.store(0), true));
        delete x;
        x = d->sharedRefcount.loadAcquire();
        x->weakref.ref();
    }
    return x;
}
```

这个时候我们看一下QObject析构时候的处理，强引用计数置0，弱引用计数-1，如果减为0则delete掉ExternalRefCountData
```cpp
QObject::~QObject()
{
    Q_D(QObject);
    d->wasDeleted = true;
    d->blockSig = 0; // unblock signals so we always emit destroyed()

    QtSharedPointer::ExternalRefCountData *sharedRefcount = d->sharedRefcount.load();
    if (sharedRefcount) {
        if (sharedRefcount->strongref.load() > 0) {
            qWarning("QObject: shared QObject was deleted directly. The program is malformed and may crash.");
            // but continue deleting, it's too late to stop anyway
        }

        // indicate to all QWeakPointers that this QObject has now been deleted
        sharedRefcount->strongref.store(0);
        if (!sharedRefcount->weakref.deref())
            delete sharedRefcount;
    }

```

## 析构函数
弱引用计数-1，如果减为0则delete掉d ，但是不会delete掉value
```cpp
inline ~QWeakPointer() { if (d && !d->weakref.deref()) delete d; }
```

## 解除循环引用
下面的例子，按照我们对智能指针的理解，在运行后Parent和Children指针均应被释放，但实际结果会告诉我们并没有
```cpp
#include <QApplication>
#include <QScopedPointer>
#include <QDebug>

class Children;
class Parent {
public:
    Parent() {

    }

    ~Parent() {
        qDebug() << __FUNCTION__ ;
    }

    QSharedPointer<Children> ptr;
};

class Children {
public:
    Children() {

    }
    ~Children() {
        qDebug() << __FUNCTION__ ;
    }

    QSharedPointer<Parent> ptr;
};


int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    // 模拟一个作用域
    {
        QSharedPointer<Parent> p(new Parent());
        QSharedPointer<Children> c(new Children());

        if(p && c){
            p->ptr = c;
            c->ptr = p;
        }
    }
    // 出了作用域，此时指针内容销毁，猜想一下输出内容是什么

    return a.exec();
}

```

对上面的代码稍作改动，将Parent和Children中的成员变量指针改成QWeakPointer，此时Parent和Children均被析构
```cpp
#include <QApplication>
#include <QScopedPointer>
#include <QDebug>

class Children;
class Parent {
public:
    Parent() {

    }

    ~Parent() {
        qDebug() << __FUNCTION__ ;
    }

    // 这里将QSharedPointer改为QWeakPointer
    QWeakPointer<Children> ptr;
};

class Children {
public:
    Children() {

    }
    ~Children() {
        qDebug() << __FUNCTION__ ;
    }

    // 这里将QSharedPointer改为QWeakPointer
    QWeakPointer<Parent> ptr;
};


int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    // 模拟一个作用域
    {
        QSharedPointer<Parent> p(new Parent());
        QSharedPointer<Children> c(new Children());

        if(p && c){
            p->ptr = c;
            c->ptr = p;
        }
    }
    // 再猜测一下输出内容

    return a.exec();
}

```
两个对象互相使用一个 QSharedPointer成员变量指向对方（你中有我，我中有你）。由于QSharedPointer是一个强引用的计数型指针，只有当引用数为0时，就会自动删除指针释放内存，但是如果循环引用，就会导致QSharedPointer指针的引用永远都不能为0，这时候就会导致内存无法释放。
所以QWeakPointer诞生了，它就是为了打破这种循环的。并且，在需要的时候变成QSharedPointer，在其他时候不干扰QSharedPointer的引用计数。它没有重载 * 和 -> 运算符，因此不可以直接通过 QWeakPointer 访问对象，典型的用法是通过 lock() 成员函数来获得 QSharedPointer，进而使用对象。


## 源码赏析
```cpp
template <class T>
class QWeakPointer
{
    typedef T *QWeakPointer:: *RestrictedBool;
    typedef QtSharedPointer::ExternalRefCountData Data;

public:
    typedef T element_type;
    typedef T value_type;
    typedef value_type *pointer;
    typedef const value_type *const_pointer;
    typedef value_type &reference;
    typedef const value_type &const_reference;
    typedef qptrdiff difference_type;

    bool isNull() const Q_DECL_NOTHROW { return d == nullptr || d->strongref.load() == 0 || value == nullptr; }
    operator RestrictedBool() const Q_DECL_NOTHROW { return isNull() ? nullptr : &QWeakPointer::value; }
    bool operator !() const Q_DECL_NOTHROW { return isNull(); }
    T *data() const Q_DECL_NOTHROW { return d == nullptr || d->strongref.load() == 0 ? nullptr : value; }

    inline QWeakPointer() Q_DECL_NOTHROW : d(nullptr), value(nullptr) { }
    inline ~QWeakPointer() { if (d && !d->weakref.deref()) delete d; }

#ifndef QT_NO_QOBJECT
    // special constructor that is enabled only if X derives from QObject
#if QT_DEPRECATED_SINCE(5, 0)
    template <class X>
    QT_DEPRECATED inline QWeakPointer(X *ptr) : d(ptr ? Data::getAndRef(ptr) : nullptr), value(ptr)
    { }
#endif
#endif

#if QT_DEPRECATED_SINCE(5, 0)
    template <class X>
    QT_DEPRECATED inline QWeakPointer &operator=(X *ptr)
    { return *this = QWeakPointer(ptr); }
#endif

    QWeakPointer(const QWeakPointer &other) Q_DECL_NOTHROW : d(other.d), value(other.value)
    { if (d) d->weakref.ref(); }
#ifdef Q_COMPILER_RVALUE_REFS
    QWeakPointer(QWeakPointer &&other) Q_DECL_NOTHROW
        : d(other.d), value(other.value)
    {
        other.d = nullptr;
        other.value = nullptr;
    }
    QWeakPointer &operator=(QWeakPointer &&other) Q_DECL_NOTHROW
    { QWeakPointer moved(std::move(other)); swap(moved); return *this; }
#endif
    QWeakPointer &operator=(const QWeakPointer &other) Q_DECL_NOTHROW
    {
        QWeakPointer copy(other);
        swap(copy);
        return *this;
    }

    void swap(QWeakPointer &other) Q_DECL_NOTHROW
    {
        qSwap(this->d, other.d);
        qSwap(this->value, other.value);
    }

    inline QWeakPointer(const QSharedPointer<T> &o) : d(o.d), value(o.data())
    { if (d) d->weakref.ref();}
    inline QWeakPointer &operator=(const QSharedPointer<T> &o)
    {
        internalSet(o.d, o.value);
        return *this;
    }

    template <class X>
    inline QWeakPointer(const QWeakPointer<X> &o) : d(nullptr), value(nullptr)
    { *this = o; }

    template <class X>
    inline QWeakPointer &operator=(const QWeakPointer<X> &o)
    {
        // conversion between X and T could require access to the virtual table
        // so force the operation to go through QSharedPointer
        *this = o.toStrongRef();
        return *this;
    }

    template <class X>
    bool operator==(const QWeakPointer<X> &o) const Q_DECL_NOTHROW
    { return d == o.d && value == static_cast<const T *>(o.value); }

    template <class X>
    bool operator!=(const QWeakPointer<X> &o) const Q_DECL_NOTHROW
    { return !(*this == o); }

    template <class X>
    inline QWeakPointer(const QSharedPointer<X> &o) : d(nullptr), value(nullptr)
    { *this = o; }

    template <class X>
    inline QWeakPointer &operator=(const QSharedPointer<X> &o)
    {
        QSHAREDPOINTER_VERIFY_AUTO_CAST(T, X); // if you get an error in this line, the cast is invalid
        internalSet(o.d, o.data());
        return *this;
    }

    template <class X>
    bool operator==(const QSharedPointer<X> &o) const Q_DECL_NOTHROW
    { return d == o.d; }

    template <class X>
    bool operator!=(const QSharedPointer<X> &o) const Q_DECL_NOTHROW
    { return !(*this == o); }

    inline void clear() { *this = QWeakPointer(); }

    inline QSharedPointer<T> toStrongRef() const { return QSharedPointer<T>(*this); }
    // std::weak_ptr compatibility:
    inline QSharedPointer<T> lock() const { return toStrongRef(); }

#if defined(QWEAKPOINTER_ENABLE_ARROW)
    inline T *operator->() const { return data(); }
#endif

private:

#if defined(Q_NO_TEMPLATE_FRIENDS)
public:
#else
    template <class X> friend class QSharedPointer;
    template <class X> friend class QPointer;
#endif

    template <class X>
    inline QWeakPointer &assign(X *ptr)
    { return *this = QWeakPointer<X>(ptr, true); }

#ifndef QT_NO_QOBJECT
    template <class X>
    inline QWeakPointer(X *ptr, bool) : d(ptr ? Data::getAndRef(ptr) : nullptr), value(ptr)
    { }
#endif

    inline void internalSet(Data *o, T *actual)
    {
        if (d == o) return;
        if (o)
            o->weakref.ref();
        if (d && !d->weakref.deref())
            delete d;
        d = o;
        value = actual;
    }

    Data *d;
    T *value;
};
```

## 附录
> 本文资料为以下链接的总结，可能大量借鉴其中内容，因此不敢说原创，仅做分享之用，如有侵权，告知必删。

[Qt--智能指针](https://blog.csdn.net/GG_SiMiDa/article/details/78667416)
[Qt智能指针--QWeakPointer](https://blog.csdn.net/luoyayun361/article/details/90286005)
[QWeakPointer Class](https://doc.qt.io/qt-6/qweakpointer.html)


