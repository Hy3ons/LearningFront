/* eslint-disable */

import './App.css';
import { useState } from 'react';

function App() {
  const [title, func] = useState(['PS 잘 하는법', '밥 먹기', '잘 자는 법']);
  const [good, func2] = useState([1, 5, 2]);

  const pressGood = () => {
    let result = [...good];

    result[0] += 1;
    func2(result);
  };

  const changeTitle = () => {
    let titles = [...title];

    titles[0] = '게임 잘 하는법';
    func(titles);
  };

  const sorting = () => {
    let titles = [...title];

    titles = titles.sort();
    // titles = titles.reverse();

    func(titles);
  };

  return (
    <div className="App">
      <div className="black-nav">
        <h4>황현석의 블로그</h4>
      </div>

      <button onClick={sorting}>가나다순 정렬</button>

      <div className="list-container">
        <div className="list">
          <h4>
            {title[0]}
            <span onClick={changeTitle}> ♥️</span>
            {good[0]}
          </h4>
          <p>2024-11-23</p>
        </div>

        <div className="list">
          <h4>
            {title[1]}
            <span onClick={pressGood}> ♥️</span> {good[1]}
          </h4>
          <p>2024-11-24</p>
        </div>

        <div className="list">
          <h4>
            {title[2]}
            <span onClick={pressGood}> ♥️</span> {good[2]}
          </h4>
          <p>2024-11-24</p>
        </div>
      </div>
    </div>
  );
}

function ModalPrac() {
  return <div></div>;
}

export default App;
