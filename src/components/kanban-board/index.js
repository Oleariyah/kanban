import React, { Component } from "react";
import "./index.css";

export default class KanbanBoard extends Component {
  constructor() {
    super();
    // Each task is uniquely identified by its name.
    // Therefore, when you perform any operation on tasks, make sure you pick tasks by names (primary key) instead of any kind of index or any other attribute.
    this.state = {
      tasks: [],
      value: "",
    };
    this.stagesNames = ["Backlog", "To Do", "Ongoing", "Done"];
  }

  handleCreateTask = (e) => {
    e.preventDefault();
    const { tasks } = this.state;
    if (this.state.value === "") {
      return;
    }

    if (tasks.find((task) => task.name === this.state.value)) {
      return;
    }

    const { value } = this.state;
    if (value.length > 0) {
      this.setState({
        tasks: [
          ...this.state.tasks,
          {
            name: value,
            stage: 0,
          },
        ],
        value: "",
      });
    }
  };

  handleValueChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleAddToNextStage = (taskName) => {
    const { tasks } = this.state;
    const taskIndex = tasks.findIndex((task) => task.name === taskName);
    const task = tasks[taskIndex];
    const nextStage = task.stage + 1;
    if (nextStage < this.stagesNames.length) {
      this.setState({
        tasks: [
          ...tasks.slice(0, taskIndex),
          {
            ...task,
            stage: nextStage,
          },
          ...tasks.slice(taskIndex + 1),
        ],
      });
    }
  };

  handleAddToPreviousStage = (taskName) => {
    const { tasks } = this.state;
    const taskIndex = tasks.findIndex((task) => task.name === taskName);
    const task = tasks[taskIndex];
    const previousStage = task.stage - 1;
    if (previousStage >= 0) {
      this.setState({
        tasks: [
          ...tasks.slice(0, taskIndex),
          {
            ...task,
            stage: previousStage,
          },
          ...tasks.slice(taskIndex + 1),
        ],
      });
    }
  };

  handleDeleteTask = (taskName) => {
    const { tasks } = this.state;
    const taskIndex = tasks.findIndex((task) => task.name === taskName);
    this.setState({
      tasks: [...tasks.slice(0, taskIndex), ...tasks.slice(taskIndex + 1)],
    });
  };

  render() {
    const { tasks } = this.state;

    let stagesTasks = [];
    for (let i = 0; i < this.stagesNames.length; ++i) {
      stagesTasks.push([]);
    }

    for (let task of tasks) {
      const stageId = task.stage;
      stagesTasks[stageId].push(task);
    }

    return (
      <div className="mt-20 layout-column justify-content-center align-items-center">
        <section className="mt-50 layout-row align-items-center justify-content-center">
          <input
            id="create-task-input"
            type="text"
            className="large"
            placeholder="New task name"
            data-testid="create-task-input"
            onChange={this.handleValueChange}
          />
          <button
            type="submit"
            className="ml-30"
            data-testid="create-task-button"
            onClick={this.handleCreateTask}
          >
            Create task
          </button>
        </section>

        <div className="mt-50 layout-row">
          {stagesTasks.map((tasks, i) => {
            return (
              <div className="card outlined ml-20 mt-0" key={`${i}`}>
                <div className="card-text">
                  <h4>{this.stagesNames[i]}</h4>
                  <ul className="styled mt-50" data-testid={`stage-${i}`}>
                    {tasks.map((task, index) => {
                      return (
                        <li className="slide-up-fade-in" key={`${i}${index}`}>
                          <div className="li-content layout-row justify-content-between align-items-center">
                            <span
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-name`}
                            >
                              {task.name}
                            </span>
                            <div className="icons">
                              <button
                                onClick={() =>
                                  this.handleAddToPreviousStage(task.name)
                                }
                                className="icon-only x-small mx-2"
                                data-testid={`${task.name
                                  .split(" ")
                                  .join("-")}-back`}
                              >
                                <i className="material-icons">arrow_back</i>
                              </button>
                              <button
                                onClick={() =>
                                  this.handleAddToNextStage(task.name)
                                }
                                className="icon-only x-small mx-2"
                                data-testid={`${task.name
                                  .split(" ")
                                  .join("-")}-forward`}
                              >
                                <i className="material-icons">arrow_forward</i>
                              </button>
                              <button
                                onClick={() => this.handleDeleteTask(task.name)}
                                className="icon-only danger x-small mx-2"
                                data-testid={`${task.name
                                  .split(" ")
                                  .join("-")}-delete`}
                              >
                                <i className="material-icons">delete</i>
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
