// Rollup plugins
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import babel from 'rollup-plugin-babel';
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from 'rollup-plugin-node-resolve';
// 解决rollup.js无法识别CommonJS模块
import commonjs from 'rollup-plugin-commonjs';
// 全局替换变量比如process.env
import replace from 'rollup-plugin-replace';
// 使rollup可以使用postCss处理样式文件less、css等
import postcss from 'rollup-plugin-postcss';
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
// import image from '@rollup/plugin-image';
// 压缩打包代码（这里弃用因为该插件不能识别es的语法，所以采用terser替代）
// import { uglify } from 'rollup-plugin-uglify';
// 压缩打包代码
import { terser } from 'rollup-plugin-terser';
// import less from 'rollup-plugin-less';
// PostCSS plugins
// 处理css定义的变量
import simplevars from 'postcss-simple-vars';
// 处理less嵌套样式写法
import nested from 'postcss-nested';
// 可以提前适用最新css特性（已废弃由postcss-preset-env替代，但还是引用进来了。。。）
// import cssnext from 'postcss-cssnext';
// 替代cssnext
import postcssPresetEnv from 'postcss-preset-env';
// css代码压缩
import cssnano from 'cssnano';
import json from '@rollup/plugin-json'

const env = process.env.NODE_ENV;

export default {
  // 入口文件我这里在components下统一导出所有自定义的组件
  input: 'test.js',
  // 输出文件夹，可以是个数组输出不同格式（umd,cjs,es...）通过env是否是生产环境打包来决定文件命名是否是.min
  output: [{
    // file: `dist/dna-ui-react-umd${env === 'production' ? '.min' : ''}.js`,
    file: 'dist/index.js',
    format: 'umd',
    name: 'geneUI',
  }
  // {
  //   file: `dist/dna-ui-react-es${env === 'production' ? '.min' : ''}.js`,
  //   format: 'es'
  // }
  ],
  // 注入全局变量比如jQuery的$这里只是尝试 并未启用
  globals: {
    react: 'React',                                         // 这跟external 是配套使用的，指明global.React即是外部依赖react
    "react-dom": "ReactDOM",
  },
  // 自定义警告事件，这里由于会报THIS_IS_UNDEFINED警告，这里手动过滤掉
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
  },
  // 将模块视为外部模块，不会打包在库中
  external: ['antd', '@ant-design/icons', 'react', 'react-dom', 'axios', 'qs'],
  // external: ['axios', 'qs', 'antd', '@ant-design/icons'],
  // 插件
  plugins: [
    json(),
    postcss({
      plugins: [
        simplevars(),
        nested(),
        // cssnext({ warnForDuplicates: false, }),
        postcssPresetEnv(),
        cssnano(),
      ],
      // 处理.css和.less文件
      extensions: [ '.css', 'less' ],
    }),
    resolve(),
    // babel处理不包含node_modules文件的所有js
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true,
      plugins: [
        "@babel/plugin-external-helpers"
      ]
    }),
    // 这里有些引入使用某个库的api但报未导出改api通过namedExports来手动导出
    commonjs({
      'namedExports': {
        'node_modules/react-is/index.js': ['isFragment', 'isValidElementType', 'isContextConsumer', 'isMemo'],
        'node_modules/react/index.js': ['Fragment', 'cloneElement', 'isValidElement', 'Children', 'createContext', 'Component', 'useRef', 'useImperativeHandle', 'forwardRef', 'useState', 'useEffect', 'useMemo', 'useLayoutEffect', 'useCallback', 'useContext'],
        'node_modules/react-dom/index.js': ['render', 'unmountComponentAtNode', 'findDOMNode', 'unstable_batchedUpdates']
      }
    }),
    // 全局替换NODE_ENV，exclude表示不包含某些文件夹下的文件
    replace({
      // exclude: 'node_modules/**',
      'process.env.NODE_ENV':  JSON.stringify(env || 'development'),
    }),
    // 生产环境执行terser压缩代码
    (env === 'production' && terser()),
  ],
}