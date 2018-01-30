import css from './css/index.css';
import less from './css/red.less';
import scss from './css/green.scss';
// import $ from 'jquery';
import json from '@/config/data.json'
import { num } from '@/foo.js'

{
    let bb = () => 123;
    let jsspanString = 'hello webpck'
    document.getElementById('title').innerHTML = `hello webpaasdsadsadcksasdasd4567891  asdasd ${jsspanString}  zhouxin    ${bb}`;
    $('#jq').html('Hello JSpang');
    $('#json').html(json.msg);
    console.log( num )
}

	