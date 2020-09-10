import React from "react";
import file from "./datafile";
import MaterialTable from "material-table";

class ChallengesList extends React.Component {
  render() {
    const MaterialTableDemo = () => {
      const [state, setState] = React.useState({
        columns: [
          { title: "Challenges", field: "title" },
          { title: "Description", field: "description" },
          { title: "Interests", field: "interests" },
          { title: "Submission Details", field: "submissionDetail" },
          { title: "Pitch", field: "pitch" }
        ],
        data: file.collections[1].contents
      });

      return (
        <MaterialTable
          title="Challenges List"
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

export default ChallengesList;
