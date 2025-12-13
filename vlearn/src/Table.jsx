/*
 *	Shuffle an array,  to be used with map
 *	return the element required by map
 * */
function shuffle(it, i, arr){
	const j = Math.floor(Math.random() * (arr.length-i)) + i;
	[arr[i], arr[j]] = [arr[j], arr[i]];
	return arr[i];
}

// Table
const data = [
    { name: "Anom", age: 19, gender: "Male", visible: true},
    { name: "Megha", age: 19, gender: "Female", visible: true},
    { name: "Subham", age: 25, gender: "Male", visible: true},
]

function f(key){
	data[key].visible = !data[key].visible;
	console.log(`Hey ${data[key].visible}`);
}
//val.visible = !val.visible
function Table(){
	return (
	<table>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>V</th>
                </tr>
                {data.map((val, key) => {
                    return (
                        <tr key={key} onClick={() => f(key)}>
                            <td>{val.name}</td>
                            <td>{val.age}</td>
                            <td>{val.gender}</td>
							<td>{val.visible? "y" : "n"}</td>
                        </tr>
                    )
                })}
            </table>
	);
}

export default Table;
