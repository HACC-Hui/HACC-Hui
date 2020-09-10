import React from "react";
import file from "./datafile";
import MaterialTable from "material-table";

class ToolsList extends React.Component {
  render() {
    const MaterialTableDemo = () => {
      const [state, setState] = React.useState({
        columns: [
          { title: "Tool", field: "name" },
          { title: "Description", field: "description" }
        ],
        data: file.collections[7].contents
      });

      return (
        <MaterialTable
          title="Tools List"
          columns={state.columns}
          data={state.data}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    setState(prevState => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              })
          }}
        />
      );
    };
    return <MaterialTableDemo></MaterialTableDemo>;
  }
}

export default ToolsList;
