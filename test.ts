interface People {
  name: string;
  age: number;
  gender: string;
}
class Student {
  constructor (private info: People) {
    this.info = info
  }
  // 需要对输入的key做限制，保证输入key一定是People类里的key；
  // 可以使用T extends keyof People来让T继承自People的联合类型映射
  public getInfo<T extends keyof People>(key: T): People[T] {
    // 现在输入key必须保证是People类的key，否则会ts错误
    return this.info[key]
  }
}

const stu = new Student({
  name: '123',
  age: 13,
  gender: 'male'
})

console.log(stu.getInfo('name'))