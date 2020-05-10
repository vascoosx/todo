import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;
export default [
	{
		input: 'todo.js',
		output: {
			file: 'public/dist/todo-bundled.js',
			sourcemap: true,
			format: 'iife',
			name: 'lit'
		},
		onwarn(warning) {
			if (warning.code !== 'THIS_IS_UNDEFINED') {
				console.error(`(!) ${warning.message}`);
			}
		},
		plugins: [
			resolve(),
			replace({'Reflect.decorate': 'undefined'}),
			commonjs(),
			!production && serve(),
			postcss({
				extract: 'utils-bundle.css'
			}),
		]
	}
];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}