import React from 'react';
import styled from 'styled-components';
import { number } from '@storybook/addon-knobs';

const options = {
  range: true,
  min: 0,
  max: 400,
  step: 10,
};

export default { title: '前端/浏览器代理/浏览器渲染页面的过程是什么' };

export const Width = () => {
  const P = styled.div`
    padding: 0 20px;
    width: 100px;
    height: 100px;
  `;
  const C = styled.div`
    width: 200%;
    height: 100px;
    background: #ccc;
  `;
  return (
    <P>
      <C></C>
    </P>
  );
};
