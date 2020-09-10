import React from "react";
import file from "./datafile";
import MaterialTable from "material-table";

class SkillsList extends React.Component {
  render() {
    const MaterialTableDemo = () => {
      const [state, setState] = React.useState({
        columns: [
          { title: "Skill", field: "name" },
          { title: "Description", field: "description" }
        ],
        data: file.collections[4].contents
      });

      return (
        <MaterialTable
          title="Skills List"
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

export default SkillsList;
