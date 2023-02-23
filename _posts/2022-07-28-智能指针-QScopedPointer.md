---
layout: post
title:  "智能指针-QScopedPointer"
date:   2022-07-28
author: ssk-wh
categories: C++
---

# QScopedPointer
Scope:范围/作用域

明确两个概念：

1、智能指针不是指针

2、智能指针持有目的指针



# 作用

这个指针的作用如名字一般，在作用域内使用的指针.在变量超出作用域范围时自动调用指针类型的析构函数进行销毁.（这里和栈上分配内存是一致的,实际就是**利用栈的特性去管理堆上的内存**）

## 构造函数
```cpp
template <typename T, typename Cleanup = QScopedPointerDeleter<T> >
class QScopedPointer
{
    typedef T *QScopedPointer:: *RestrictedBool;
public:
    explicit QScopedPointer(T *p = nullptr) Q_DECL_NOTHROW : d(p)
    {
    }
    
...
        
    protected:
    T *d;

private:
    Q_DISABLE_COPY(QScopedPointer)
};
```
构造时传入T类型的指针p,并通过成员变量d进行保存(还是不由自主地感叹了下模板真好用^_^)

构造函数比较简单,按照其实现,用法如下:
```cpp
QScopedPointer<MyClass> mc(new MyClass);
// 和上面的用法相同
QScopedPointer<MyClass, QScopedPointerDeleter> mc(new MyClass);
```

模板参数中的Cleanup默认使用的是QScopedPointerDeleter，即默认使用delete对指向的内存进行销毁。见删除器小节。

如果仔细一些，会发现构造函数中有如下一行代码，并进行了实现：
```cpp

    typedef T *QScopedPointer:: *RestrictedBool;


#if defined(Q_QDOC)
    inline operator bool() const
    {
        return isNull() ? nullptr : &QScopedPointer::d;
    }
#else
    operator RestrictedBool() const Q_DECL_NOTHROW
    {
        return isNull() ? nullptr : &QScopedPointer::d;
    }
#endif
```

这里其实是对隐式转换做了限制，避免用指针做比较时，除了转换成bool类型不能转换其他的类型,例如下面的代码会在编译期就提示你有错误：
```cpp
QScopedPointer<Foo> foo(nullptr);
int i = 1;
if (foo < i)
    ...
```

但是这样是可以的：
```cpp
QScopedPointer<Foo> foo(nullptr);
int i = 1;
if (foo)
    ...
```

## 析构函数
在QScopedPointer超出作用域后，智能指针本身(分配在栈上)自动销毁，触发析构函数。在析构函数中，提供了统一的`**清理**`函数**Cleanup::cleanup(oldD);**对oldD(智能指针指向的内存)进行销毁.
```cpp
    inline ~QScopedPointer()
    {
        T *oldD = this->d;
        Cleanup::cleanup(oldD);
    }
```
关于Cleanup的介绍见下一小节.

## 删除器
QScopedPointer不仅适用于通过new操作符分配的单个内存和一组内存(数组),也可用于通过malloc进行分配的内存。同时，针对QObject的deleteLater特性，也有相关处理。这里要说一下他的Cleanup删除器(非专有名词，只有我这样称呼)的概念。
Cleanup用于超出作用域时自动销毁指针指向的内存，针对不同方式分配的内存，提供了不同的销毁方式：

| **删除器种类** | **如何销毁** | **销毁内存的分配方式** |
| --- | --- | --- |
| QScopedPointerDeleter | delete | 使用new分配的内存 |
| QScopedPointerArrayDeleter | delet[] | 使用new []分配内存 |
| QScopedPointerPodDeleter | free | 内存由malloc进行分配 |
| QScopedPointerObjectDeleteLater | delateLater | 当你的指针为QObject类型时，并且处于一个QEventLoop中 |


你也可以实现自己的删除器，它们需要具有公共静态函数 void cleanup(T *pointer).
```cpp
  // this QScopedPointer deletes its data using the delete[] operator:
  QScopedPointer<int, QScopedPointerArrayDeleter<int> > arrayPointer(new int[42]);

  // this QScopedPointer frees its data using free():
  QScopedPointer<int, QScopedPointerPodDeleter> podPointer(reinterpret_cast<int *>(malloc(42)));

  // this struct calls "myCustomDeallocator" to delete the pointer
  struct ScopedPointerCustomDeleter
  {
      static inline void cleanup(MyCustomClass *pointer)
      {
          myCustomDeallocator(pointer);
      }
  };

  // QScopedPointer using a custom deleter:
  QScopedPointer<MyCustomClass, ScopedPointerCustomDeleter> customPointer(new MyCustomClass);
```


## 方法一览

| 原型 | 接口说明 |
| --- | --- |
| QScopedPointer(T *p = ...) | Constructs this QScopedPointer instance and sets its pointer to p. |
| ~QScopedPointer() | Destroys this QScopedPointer object. Delete the object its pointer points to. |
| T * data() const | Returns the value of the pointer referenced by this object. QScopedPointer still owns the object pointed to. |
| T * get() const | Same as data(). |
| bool isNull() const | Returns true if this object is holding a pointer that is null. |
| void reset(T *other = ...) | Deletes the existing object it is pointing to (if any), and sets its pointer to other. QScopedPointer now owns other and will delete it in its destructor. To clear the pointer held without deleting the object it points to (and hence take ownership of the object), use take() instead. |
| void swap(QScopedPointer<T, Cleanup> &other) | Swap this pointer with _other_. |
| T * take() | Returns the value of the pointer referenced by this object. The pointer of this QScopedPointer object will be reset to null. Callers of this function take ownership of the pointer. |
| bool operator bool() const | Returns true if this object is not null. This function is suitable for use in if-constructs, like:if (scopedPointer) {...} See also isNull(). |
| bool operator!() const | Returns true if the pointer referenced by this object is null, otherwise returns false.See also isNull(). |
| T & operator*() const | Provides access to the scoped pointer's object.If the contained pointer is null, behavior is undefined.See also isNull(). |
| T * operator->() const | Provides access to the scoped pointer's object.If the contained pointer is null, behavior is undefined.See also isNull(). |


## 实际场景
```cpp
void myFunction(bool useSubClass)
  {
      MyClass *p = useSubClass ? new MyClass() : new MySubClass;
      QIODevice *device = handsOverOwnership();

      if (m_value > 3) {
          delete p;
          delete device;
          return;
      }

      try {
          process(device);
      }
      catch (...) {
          delete p;
          delete device;
          throw;
      }

      delete p;
      delete device;
  }
```

如果使用QScopedPointer,可以这样写
```cpp
 void myFunction(bool useSubClass)
  {
      // assuming that MyClass has a virtual destructor
      QScopedPointer<MyClass> p(useSubClass ? new MyClass() : new MySubClass);
      QScopedPointer<QIODevice> device(handsOverOwnership());

      if (m_value > 3)
          return;

      process(device);
  }
```

QScopedPointer intentionally has no copy constructor or assignment operator, such that ownership and lifetime is clearly communicated.
QScopedPointer故意去除了拷贝构造和赋值构造函数，因为指针不能被传递和复制，这样关于指针的所有权和生命周期就很明确(跟随智能指针的销毁而销毁).

如果你的指针需要用const限定符去修饰，使用QScopedPointer后也是支持的
```cpp
      const QWidget *const p = new QWidget();
      // is equivalent to:
      const QScopedPointer<const QWidget> p(new QWidget());

      QWidget *const p = new QWidget();
      // is equivalent to:
      const QScopedPointer<QWidget> p(new QWidget());

      const QWidget *p = new QWidget();
      // is equivalent to:
      QScopedPointer<const QWidget> p(new QWidget());
 
```

## QScopedArrayPointer
和QScopedPointer不同的是，他的删除器默认是QScopedPointerArrayDeleter，其他都差不多，我们了解即可
```cpp
template <typename T, typename Cleanup = QScopedPointerArrayDeleter<T> >
class QScopedArrayPointer : public QScopedPointer<T, Cleanup>
{
    template <typename Ptr>
    using if_same_type = typename std::enable_if<std::is_same<typename std::remove_cv<T>::type, Ptr>::value, bool>::type;
public:
    inline QScopedArrayPointer() : QScopedPointer<T, Cleanup>(nullptr) {}

    template <typename D, if_same_type<D> = true>
    explicit QScopedArrayPointer(D *p)
        : QScopedPointer<T, Cleanup>(p)
    {
    }
```

## 源码赏析
```cpp
/****************************************************************************
**
** Copyright (C) 2016 The Qt Company Ltd.
** Contact: https://www.qt.io/licensing/
**
** This file is part of the QtCore module of the Qt Toolkit.
**
** $QT_BEGIN_LICENSE:LGPL$
** Commercial License Usage
** Licensees holding valid commercial Qt licenses may use this file in
** accordance with the commercial license agreement provided with the
** Software or, alternatively, in accordance with the terms contained in
** a written agreement between you and The Qt Company. For licensing terms
** and conditions see https://www.qt.io/terms-conditions. For further
** information use the contact form at https://www.qt.io/contact-us.
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 3 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL3 included in the
** packaging of this file. Please review the following information to
** ensure the GNU Lesser General Public License version 3 requirements
** will be met: https://www.gnu.org/licenses/lgpl-3.0.html.
**
** GNU General Public License Usage
** Alternatively, this file may be used under the terms of the GNU
** General Public License version 2.0 or (at your option) the GNU General
** Public license version 3 or any later version approved by the KDE Free
** Qt Foundation. The licenses are as published by the Free Software
** Foundation and appearing in the file LICENSE.GPL2 and LICENSE.GPL3
** included in the packaging of this file. Please review the following
** information to ensure the GNU General Public License requirements will
** be met: https://www.gnu.org/licenses/gpl-2.0.html and
** https://www.gnu.org/licenses/gpl-3.0.html.
**
** $QT_END_LICENSE$
**
****************************************************************************/

#ifndef QSCOPEDPOINTER_H
#define QSCOPEDPOINTER_H

#include <QtCore/qglobal.h>

#include <stdlib.h>

QT_BEGIN_NAMESPACE

template <typename T>
    struct QScopedPointerDeleter
    {
        static inline void cleanup(T *pointer)
        {
            // Enforce a complete type.
            // If you get a compile error here, read the section on forward declared
            // classes in the QScopedPointer documentation.
            typedef char IsIncompleteType[ sizeof(T) ? 1 : -1 ];
            (void) sizeof(IsIncompleteType);
            
            delete pointer;
        }
    };

template <typename T>
struct QScopedPointerArrayDeleter
{
    static inline void cleanup(T *pointer)
    {
        // Enforce a complete type.
        // If you get a compile error here, read the section on forward declared
        // classes in the QScopedPointer documentation.
        typedef char IsIncompleteType[ sizeof(T) ? 1 : -1 ];
        (void) sizeof(IsIncompleteType);
        
        delete [] pointer;
    }
};

struct QScopedPointerPodDeleter
{
    static inline void cleanup(void *pointer) { if (pointer) free(pointer); }
};

#ifndef QT_NO_QOBJECT
template <typename T>
struct QScopedPointerObjectDeleteLater
{
    static inline void cleanup(T *pointer) { if (pointer) pointer->deleteLater(); }
};

class QObject;
typedef QScopedPointerObjectDeleteLater<QObject> QScopedPointerDeleteLater;
#endif

template <typename T, typename Cleanup = QScopedPointerDeleter<T> >
class QScopedPointer
{
    typedef T *QScopedPointer:: *RestrictedBool;
    public:
    explicit QScopedPointer(T *p = nullptr) Q_DECL_NOTHROW : d(p)
    {
    }
    
    inline ~QScopedPointer()
    {
        T *oldD = this->d;
        Cleanup::cleanup(oldD);
    }
    
    inline T &operator*() const
    {
        Q_ASSERT(d);
        return *d;
    }
    
    T *operator->() const Q_DECL_NOTHROW
    {
        return d;
    }
    
    bool operator!() const Q_DECL_NOTHROW
    {
        return !d;
    }
    
    #if defined(Q_QDOC)
    inline operator bool() const
    {
        return isNull() ? nullptr : &QScopedPointer::d;
    }
    #else
    operator RestrictedBool() const Q_DECL_NOTHROW
    {
        return isNull() ? nullptr : &QScopedPointer::d;
    }
    #endif
    
    T *data() const Q_DECL_NOTHROW
    {
        return d;
    }
    
    T *get() const Q_DECL_NOTHROW
    {
        return d;
    }
    
    bool isNull() const Q_DECL_NOTHROW
    {
        return !d;
    }
    
    void reset(T *other = nullptr) Q_DECL_NOEXCEPT_EXPR(noexcept(Cleanup::cleanup(std::declval<T *>())))
    {
        if (d == other)
            return;
        T *oldD = d;
        d = other;
        Cleanup::cleanup(oldD);
    }
    
    T *take() Q_DECL_NOTHROW
    {
        T *oldD = d;
        d = nullptr;
        return oldD;
    }
    
    void swap(QScopedPointer<T, Cleanup> &other) Q_DECL_NOTHROW
    {
        qSwap(d, other.d);
    }
    
    typedef T *pointer;
    
    protected:
    T *d;
    
    private:
    Q_DISABLE_COPY(QScopedPointer)
    };

template <class T, class Cleanup>
inline bool operator==(const QScopedPointer<T, Cleanup> &lhs, const QScopedPointer<T, Cleanup> &rhs) Q_DECL_NOTHROW
{
return lhs.data() == rhs.data();
}

template <class T, class Cleanup>
inline bool operator!=(const QScopedPointer<T, Cleanup> &lhs, const QScopedPointer<T, Cleanup> &rhs) Q_DECL_NOTHROW
{
return lhs.data() != rhs.data();
}

template <class T, class Cleanup>
inline bool operator==(const QScopedPointer<T, Cleanup> &lhs, std::nullptr_t) Q_DECL_NOTHROW
{
return lhs.isNull();
}

template <class T, class Cleanup>
inline bool operator==(std::nullptr_t, const QScopedPointer<T, Cleanup> &rhs) Q_DECL_NOTHROW
{
return rhs.isNull();
}

template <class T, class Cleanup>
inline bool operator!=(const QScopedPointer<T, Cleanup> &lhs, std::nullptr_t) Q_DECL_NOTHROW
{
return !lhs.isNull();
}

template <class T, class Cleanup>
inline bool operator!=(std::nullptr_t, const QScopedPointer<T, Cleanup> &rhs) Q_DECL_NOTHROW
{
return !rhs.isNull();
}

template <class T, class Cleanup>
inline void swap(QScopedPointer<T, Cleanup> &p1, QScopedPointer<T, Cleanup> &p2) Q_DECL_NOTHROW
{ p1.swap(p2); }

template <typename T, typename Cleanup = QScopedPointerArrayDeleter<T> >
class QScopedArrayPointer : public QScopedPointer<T, Cleanup>
{
template <typename Ptr>
using if_same_type = typename std::enable_if<std::is_same<typename std::remove_cv<T>::type, Ptr>::value, bool>::type;
public:
inline QScopedArrayPointer() : QScopedPointer<T, Cleanup>(nullptr) {}

template <typename D, if_same_type<D> = true>
explicit QScopedArrayPointer(D *p)
: QScopedPointer<T, Cleanup>(p)
{
}

inline T &operator[](int i)
{
return this->d[i];
}

inline const T &operator[](int i) const
{
return this->d[i];
}

void swap(QScopedArrayPointer &other) Q_DECL_NOTHROW // prevent QScopedPointer <->QScopedArrayPointer swaps
{ QScopedPointer<T, Cleanup>::swap(other); }

private:
explicit inline QScopedArrayPointer(void *) {
// Enforce the same type.

// If you get a compile error here, make sure you declare
// QScopedArrayPointer with the same template type as you pass to the
// constructor. See also the QScopedPointer documentation.

// Storing a scalar array as a pointer to a different type is not
// allowed and results in undefined behavior.
}

Q_DISABLE_COPY(QScopedArrayPointer)
};

template <typename T, typename Cleanup>
inline void swap(QScopedArrayPointer<T, Cleanup> &lhs, QScopedArrayPointer<T, Cleanup> &rhs) Q_DECL_NOTHROW
{ lhs.swap(rhs); }

QT_END_NAMESPACE

#endif // QSCOPEDPOINTER_H

```

## 附录
> 本文资料为以下链接的总结，可能大量借鉴其中内容，因此不敢说原创，仅做分享之用，如有侵权，告知必删。

[QScopedPointer Class](https://doc.qt.io/qt-6/qscopedpointer.html)

