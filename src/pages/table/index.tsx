import React from 'react';
import './index.less';

const Table = () => {
  return (
    <table>
      {new Array(10).fill(1).map((_, index) => {
        return (
          <tr key={index}>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
            <td>
              <a href="https://baidu.com">baidu.com</a>
            </td>
          </tr>
        );
      })}
    </table>
  );
};

export default Table;
