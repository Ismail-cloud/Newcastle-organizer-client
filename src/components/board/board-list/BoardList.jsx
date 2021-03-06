import React, { useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./BoardList.scss";
import FloatingTaskMenu from "./Subcomponents/floating-task-menu/FloatingTaskMenu";
import ListAdder from "./Subcomponents/list-adder/ListAdder";
import TaskAdder from "./Subcomponents/task-adder/TaskAdder";
import Task from "./Subcomponents/task/Task";
import TitleList from "./Subcomponents/title-list/TitleList";

const BoardList = ({ listData, taskData, FloatMenuData }) => {
  const [list, changeList] = useState(listData);
  const [task, changeTask] = useState(taskData);
  const [floatMenu, changeFloatMenu] = useState(FloatMenuData);

  const listItem = useRef();
  const listIndexNumber = useRef();
  const taskIndexNumber = useRef();
  const floatMenuTitle = useRef();

  const handleTaskTitleClick = (e, listIndex) => {
    let listCopy = [...list];
    listCopy[listIndex].titleEditable = true;
    changeList(listCopy);
  };

  const handleTitleEditing = (listIndex) => {
    if (list[listIndex].titleEditable) {
      return "title__list--active";
    } else {
      return "title__list";
    }
  };

  const handleKeyPressed = (e, listIndex) => {
    if (e.key === "Enter") {
      let listCopy = [...list];
      listCopy[listIndex].title = e.target.value.replace(/[\r\n\v]+/g, "");
      listCopy[listIndex].titleEditable = false;
      e.preventDefault();
      changeList(listCopy);
    }
  };

  const handleTaskTitleChange = (e) => {
    floatMenuTitle.current = e.target;
    if (e.key === "Enter") {
      let taskCopy = [...task];
      let taskItemId = parseInt(
        list[listIndexNumber.current].tasks[taskIndexNumber.current].id
      );
      taskCopy[taskItemId].Title = e.target.value.replace(/[\r\n\v]+/g, "");
      changeTask(taskCopy);
    }
  };

  const handleTaskDescriptionChange = (e) => {
    if (e.key === "Enter") {
      let taskCopy = [...task];
      let taskItemId =
        list[listIndexNumber.current].tasks[taskIndexNumber.current].id;
      taskCopy[taskItemId].Description = e.target.value;
      changeTask(taskCopy);
    }
  };

  const handleTaskCreation = (listIndex) => {
    let listCopy = [...list];
    let taskCopy = [...task];
    let newTask = {
      // It needs to be an string in order to be accepted by react-beautiful-dnd as a draggable
      id: taskCopy.length.toString(),
      Title: "New Task",
      Attachments: 2,
      Comments: 6,
      DueDate: "04/04/2020",
      Labels: "Discovery",
      TeamMembers: "Jhon",
    };
    taskCopy = [...taskCopy, newTask];
    taskCopy.push(newTask);
    changeTask(taskCopy);
    listCopy[listIndex].tasks = [
      ...listCopy[listIndex].tasks,
      taskCopy[task.length],
    ];
    changeList(listCopy);
  };

  const handleFloatMenuState = () => {
    if (floatMenu[0].isActive) {
      return "float-menu__active";
    } else {
      return "float-menu__unactive";
    }
  };

  const handleTaskClick = (e, task, listIndex, taskIndex) => {
    let floatMenuCopy = [...floatMenu];
    floatMenuCopy[0].title = task.Title;
    floatMenuCopy[0].description = task.Description;
    floatMenuCopy[0].isActive = true;
    listIndexNumber.current = listIndex;
    taskIndexNumber.current = taskIndex;
    changeFloatMenu(floatMenuCopy);
  };

  const handleCloseFloatMenu = () => {
    // floatMenuTitle.current.value = "";
    let floatMenuCopy = [...floatMenu];
    floatMenuCopy[0].isActive = false;
    listIndexNumber.current = null;
    taskIndexNumber.current = null;
    changeFloatMenu(floatMenuCopy);
  };

  const handleListCreation = () => {
    let listCopy = [...list];
    let newList = {
      // It needs to be an string in order to be accepted by react-beautiful-dnd as a draggable
      id: listCopy.length.toString(),
      title: "New List",
      titleEditable: false,
      tasks: [],
    };

    listCopy = [...listCopy, newList];
    changeList(listCopy);
  };

  const handleTaskDragEnd = (result) => {
    if (!result.destination) return;
    const listsObjects = [...list];
    const taskToMove = listsObjects[result.source.droppableId].tasks.splice(
      result.source.index - 1,
      1
    );
    listsObjects[result.destination.droppableId].tasks.splice(
      result.destination.index - 1,
      0,
      taskToMove[0]
    );
  };

  const handleShowingListMenu = (listIndex) => {
    if (list[listIndex].menuActive) {
      return "title__list__menu__options--active";
    } else {
      return "title__list__menu__options";
    }
  };

  const handleActivatingListMenu = (e, listIndex) => {
    let listCopy = [...list];
    if (list[listIndex].menuActive) {
      listCopy[listIndex].menuActive = false;
      listItem.current = null;
      changeList(listCopy);
    } else {
      listCopy[listIndex].menuActive = true;
      listItem.current = listIndex;
      changeList(listCopy);
    }
  };

  const handleDeleteList = () => {
    let listCopy = [...list];
    listCopy.splice(listItem.current, 1);
    changeList(listCopy);
  };

  const handleShowingTaskMenu = (listIndex, taskIndex) => {
    if (list[listIndex].tasks[taskIndex].menuActive) {
      return "task__options__button__menu__options--active";
    } else {
      return "task__options__button__menu__options";
    }
  };

  const handleActivatingTaskMenu = (listIndex, taskIndex) => {
    let taskCopy = [...task];
    let taskItemId = list[listIndex].tasks[taskIndex].id;
    if (taskCopy[taskItemId].menuActive) {
      taskCopy[taskItemId].menuActive = false;
    } else {
      taskCopy[taskItemId].menuActive = true;
    }
    changeTask(taskCopy);
  };

  const handleDeleteTask = (listIndex, taskIndex) => {
    let listCopy = [...list];

    listCopy[listIndex].tasks.splice([taskIndex], 1);
    changeList(listCopy);
  };

  return (
    <div className="board__list__wrapper">
      <DragDropContext onDragEnd={handleTaskDragEnd}>
        {list.map((list, listIndex) => (
          <ul className="board__list">
            <li className="board__list__item">
              <TitleList
                listTitle={list.title}
                handleTitleEditing={handleTitleEditing(listIndex)}
                handleTaskTitleClick={(e) => handleTaskTitleClick(e, listIndex)}
                handleKeyPressed={(e) => handleKeyPressed(e, listIndex)}
                handleShowingListMenu={handleShowingListMenu(listIndex)}
                handleActivatingListMenu={(e) =>
                  handleActivatingListMenu(e, listIndex)
                }
                handleDeleteList={() => handleDeleteList()}
              />
            </li>
            <Droppable droppableId={list.id}>
              {(propvided) => (
                <div
                  className="board__list__item__div"
                  {...propvided.droppableProps}
                  ref={propvided.innerRef}
                >
                  {list.tasks.map((task, taskIndex) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={taskIndex + 1}
                    >
                      {(provided) => (
                        <li
                          className="board__list__item"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Task
                            taskTitle={task.Title}
                            taskAttachments={task.Attachments}
                            taskComments={task.Comments}
                            taskDueDate={task.DueDate}
                            taskLabels={task.Labels}
                            taskTeamMembers={task.TeamMembers}
                            handleTaskClick={(e) =>
                              handleTaskClick(e, task, listIndex, taskIndex)
                            }
                            handleShowingTaskMenu={handleShowingTaskMenu(
                              listIndex,
                              taskIndex
                            )}
                            handleActivatingTaskMenu={() =>
                              handleActivatingTaskMenu(listIndex, taskIndex)
                            }
                            handleDeleteTask={() =>
                              handleDeleteTask(listIndex, taskIndex)
                            }
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {propvided.placeholder}
                </div>
              )}
            </Droppable>
            <li className="board__list__item">
              <TaskAdder
                handleTaskCreation={() => handleTaskCreation(listIndex)}
              />
            </li>
          </ul>
        ))}
      </DragDropContext>
      <div className={handleFloatMenuState()}>
        <FloatingTaskMenu
          handleCloseFloatMenu={() => handleCloseFloatMenu()}
          menuTitle={floatMenu[0].title}
          menuDescription={floatMenu[0].description}
          handleTaskTitleChange={(e) => handleTaskTitleChange(e)}
          handleTaskDescriptionChange={(e) => handleTaskDescriptionChange(e)}
        />
      </div>
      <ListAdder handleListCreation={() => handleListCreation()} />
    </div>
  );
};

export default BoardList;
