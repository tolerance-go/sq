import React, {
  memo,
  FC,
  useCallback,
  Ref,
  HTMLAttributes,
  useState,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';

export const StopPropagation = () => {
  const ref = useRef(null);
  const Container = styled.div`
    #a {
      background-color: #aaa;
      width: ${200 * 3}px;
      height: ${200 * 3}px;
      #b {
        background-color: #bbb;
        width: ${200 * 2}px;
        height: ${200 * 2}px;
        #c {
          background-color: #ccc;
          width: 200px;
          height: 200px;
        }
      }
    }
  `;

  useEffect(() => {
    const a = document.getElementById('a');
    const b = document.getElementById('b');
    const c = document.getElementById('c');

    b.addEventListener(
      'click',
      (e) => {
        e.stopPropagation();
      },
      true,
    );
    c.addEventListener('click', (e) => console.log('c:cap'));
    a.addEventListener('click', (e) => console.log('a:cap'));
  }, []);
  return (
    <Container ref={ref}>
      <div id="a">
        <div id="b">
          <div id="c"></div>
        </div>
      </div>
    </Container>
  );
};

export const CancelBubble = () => {
  const ref = useRef(null);
  const Container = styled.div`
    #a {
      background-color: #aaa;
      width: ${200 * 3}px;
      height: ${200 * 3}px;
      #b {
        background-color: #bbb;
        width: ${200 * 2}px;
        height: ${200 * 2}px;
        #c {
          background-color: #ccc;
          width: 200px;
          height: 200px;
        }
      }
    }
  `;

  useEffect(() => {
    const a = document.getElementById('a');
    const b = document.getElementById('b');
    const c = document.getElementById('c');

    b.addEventListener(
      'click',
      (e) => {
        e.cancelBubble = true;
      },
      true,
    );
    c.addEventListener('click', (e) => console.log('c:cap'));
    a.addEventListener('click', (e) => console.log('a:cap'));
  }, []);
  return (
    <Container ref={ref}>
      <div id="a">
        <div id="b">
          <div id="c"></div>
        </div>
      </div>
    </Container>
  );
};

export const PreventDefault = () => {
  const ref = useRef(null);
  const Container = styled.div`
    a {
      font-size: 18px;
      margin-left: 40px;
    }
  `;

  useEffect(() => {
    const a = document.getElementById('a');
    const b = document.getElementById('b');
    const c = document.getElementById('c');

    a.addEventListener('click', (e) => false);
    b.onclick = (e) => false;
    c.addEventListener('click', (e) => e.preventDefault());
  }, []);
  return (
    <Container ref={ref}>
      <a id="a" href="https://github.com/tolerance-go/keep-learning">
        a
      </a>
      <a id="b" href="https://github.com/tolerance-go/keep-learning">
        b
      </a>
      <a id="c" href="https://github.com/tolerance-go/keep-learning">
        c
      </a>
    </Container>
  );
};

export const ViaOrder = () => {
  const ref = useRef(null);
  const Container = styled.div``;

  useEffect(() => {
    const button = document.getElementById('test-btn');
    button.addEventListener(
      'click',
      function () {
        alert('ONE');
      },
      false,
    );
    button.onclick = () => {};
    button.addEventListener(
      'click',
      function () {
        alert('THREE');
      },
      false,
    );
    button.onclick = function () {
      alert('TWO');
    };
    button.addEventListener(
      'click',
      function () {
        alert('FOUR');
      },
      false,
    );
  }, []);
  return (
    <Container ref={ref}>
      <button id="test-btn">Start Demo</button>
    </Container>
  );
};

export const Proxy = () => {
  const ref = useRef(null);
  const Container = styled.div`
    #a {
      background-color: #aaa;
      width: ${200 * 3}px;
      height: ${200 * 3}px;
      #b {
        background-color: #bbb;
        width: ${200 * 2}px;
        height: ${200 * 2}px;
        #c {
          background-color: #ccc;
          width: 200px;
          height: 200px;
        }
      }
    }
  `;

  useEffect(() => {
    const a = document.getElementById('a');
    const b = document.getElementById('b');
    const c = document.getElementById('c');

    a.addEventListener(
      'click',
      (e) => {
        console.log('proxy', e.target.id);
      },
      // true,
    );
  }, []);
  return (
    <Container ref={ref}>
      <div id="a">
        <div id="b">
          <div id="c"></div>
        </div>
      </div>
    </Container>
  );
};

export default { title: '前端/代理/浏览器事件机制是什么' };
