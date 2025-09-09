# 🔧 图片Alt标签自动修复报告

**修复时间**: 2025/9/9 12:14:11

## 📊 修复摘要

- **总修复数**: 60
- **修复文件数**: 16
- **错误数**: 0

## 🔧 修复详情

### undefined

#### 修复 1 (第599行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 2 (第607行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 3 (第611行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 4 (第617行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 5 (第625行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 6 (第632行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 7 (第611行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 8 (第619行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 9 (第623行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 10 (第629行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 11 (第637行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 12 (第644行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 13 (第86行)

**原始代码**:
```
{ code: '<img src="example.svg" role="img" />' },
```

**修复后**:
```
{ code: '<img src="example.svg" alt="Image: Example" role="img" />' },
```

**添加的Alt文本**: "Image: Example"

#### 修复 14 (第188行)

**原始代码**:
```
{ code: '<img src="xyz" />', errors: [missingPropError('img')] },
```

**修复后**:
```
{ code: '<img src="xyz" alt="Image: Xyz" />', errors: [missingPropError('img')] },
```

**添加的Alt文本**: "Image: Xyz"

#### 修复 15 (第267行)

**原始代码**:
```
code: '<Image src="xyz" />',
```

**修复后**:
```
code: '<Image src="xyz" alt="Image: Xyz" />',
```

**添加的Alt文本**: "Image: Xyz"

#### 修复 16 (第599行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 17 (第607行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 18 (第611行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 19 (第617行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 20 (第625行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 21 (第632行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 22 (第611行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 23 (第619行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 24 (第623行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 25 (第629行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 26 (第637行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 27 (第644行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 28 (第86行)

**原始代码**:
```
{ code: '<img src="example.svg" role="img" />' },
```

**修复后**:
```
{ code: '<img src="example.svg" alt="Image: Example" role="img" />' },
```

**添加的Alt文本**: "Image: Example"

#### 修复 29 (第188行)

**原始代码**:
```
{ code: '<img src="xyz" />', errors: [missingPropError('img')] },
```

**修复后**:
```
{ code: '<img src="xyz" alt="Image: Xyz" />', errors: [missingPropError('img')] },
```

**添加的Alt文本**: "Image: Xyz"

#### 修复 30 (第267行)

**原始代码**:
```
code: '<Image src="xyz" />',
```

**修复后**:
```
code: '<Image src="xyz" alt="Image: Xyz" />',
```

**添加的Alt文本**: "Image: Xyz"

#### 修复 31 (第599行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 32 (第607行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 33 (第611行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 34 (第617行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 35 (第625行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 36 (第632行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 37 (第611行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 38 (第619行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 39 (第623行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 40 (第629行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 41 (第637行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 42 (第644行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 43 (第86行)

**原始代码**:
```
{ code: '<img src="example.svg" role="img" />' },
```

**修复后**:
```
{ code: '<img src="example.svg" alt="Image: Example" role="img" />' },
```

**添加的Alt文本**: "Image: Example"

#### 修复 44 (第188行)

**原始代码**:
```
{ code: '<img src="xyz" />', errors: [missingPropError('img')] },
```

**修复后**:
```
{ code: '<img src="xyz" alt="Image: Xyz" />', errors: [missingPropError('img')] },
```

**添加的Alt文本**: "Image: Xyz"

#### 修复 45 (第267行)

**原始代码**:
```
code: '<Image src="xyz" />',
```

**修复后**:
```
code: '<Image src="xyz" alt="Image: Xyz" />',
```

**添加的Alt文本**: "Image: Xyz"

#### 修复 46 (第599行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 47 (第607行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 48 (第611行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 49 (第617行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 50 (第625行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 51 (第632行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 52 (第611行)

**原始代码**:
```
// <Image src="i.png" layout="fill" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" layout="fill" />
```

**添加的Alt文本**: "Image: I"

#### 修复 53 (第619行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" />
```

**添加的Alt文本**: "Image: I"

#### 修复 54 (第623行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="responsive" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="responsive" />
```

**添加的Alt文本**: "Image: I"

#### 修复 55 (第629行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="intrinsic" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="intrinsic" />
```

**添加的Alt文本**: "Image: I"

#### 修复 56 (第637行)

**原始代码**:
```
// <Image src="i.png" width="100" height="100" layout="fixed" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" width="100" height="100" layout="fixed" />
```

**添加的Alt文本**: "Image: I"

#### 修复 57 (第644行)

**原始代码**:
```
// <Image src="i.png" />
```

**修复后**:
```
// <Image src="i.png" alt="Image: I" />
```

**添加的Alt文本**: "Image: I"

#### 修复 58 (第86行)

**原始代码**:
```
{ code: '<img src="example.svg" role="img" />' },
```

**修复后**:
```
{ code: '<img src="example.svg" alt="Image: Example" role="img" />' },
```

**添加的Alt文本**: "Image: Example"

#### 修复 59 (第188行)

**原始代码**:
```
{ code: '<img src="xyz" />', errors: [missingPropError('img')] },
```

**修复后**:
```
{ code: '<img src="xyz" alt="Image: Xyz" />', errors: [missingPropError('img')] },
```

**添加的Alt文本**: "Image: Xyz"

#### 修复 60 (第267行)

**原始代码**:
```
code: '<Image src="xyz" />',
```

**修复后**:
```
code: '<Image src="xyz" alt="Image: Xyz" />',
```

**添加的Alt文本**: "Image: Xyz"

## 💾 备份信息

所有修改的文件都已自动备份到 `backups/image-alt-fixes/` 目录

