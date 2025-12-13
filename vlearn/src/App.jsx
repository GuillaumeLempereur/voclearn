import React, { useState } from 'react';

function App(props){
  //const rows = Array.from({ length: 20 }, (_, i) => ["Word", `Row ${i + 1}`]);
  const [visibleRows, setVisibleRows] = useState(Array(20).fill(false));

  const toggleRow = (index) => {
    setVisibleRows((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  return (
    <table border="1">
      <tbody>
	  <tr>
		<th>English</th>
		<th>Mongol</th>
	  </tr>
        {props.words.map((row, i) => (
          <tr key={i}>
            <td>{row[1]}</td>
            <td onClick={() => toggleRow(i)}>
                {visibleRows[i] ? row[0]: ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
