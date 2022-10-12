import React, { Children, useState } from "react";
import { useMinimizeStore } from "../../../store/useStore";
import { ColumnType, EmployeeRowType, RowType } from "../../../types/table";
import { Checkbox, Avatar } from "@mantine/core";
import Modal from "../../headless/modal/modal";

const EmployeeTable = (props: {
  checkboxes: number[];
  setCheckboxes: React.Dispatch<React.SetStateAction<number[]>>;
  filterBy: string[];
  rows: EmployeeRowType[];
  columns: ColumnType[];
}) => {
  const { minimize } = useMinimizeStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const selectAllCheckboxes = () => {
    if (props.checkboxes.length === 0) {
      props.setCheckboxes([-1]);
    } else {
      props.setCheckboxes([]);
    }
  };

  const toggleCheckbox = async (id: number) => {
    if (props.checkboxes.includes(id)) {
      // removes id if not selected
      props.setCheckboxes((prev) => prev.filter((e) => e !== id));
      return;
    }
    // adds id
    props.setCheckboxes((prev) => [...prev, id]);
  };

  const getProperty = (filter: string, asset: RowType | EmployeeRowType) => {
    //get object property
    return Object.getOwnPropertyDescriptor(asset, filter)?.value ?? "No Value";
  };

  const showDetails = () => {
    return (
      <Modal
        title={"Employee Details"}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        cancelButton
        className="max-w-lg"
      >
        <div>
          <div className="flex flex-row items-center gap-4 py-5">
            <Avatar src="avatar.png" alt="it's me" radius={200} size={100} />
            <div className="flex flex-col">
              <div className="flex flex-row">
                <text className="font-bold text-xl">
                  Clea Bernadette D. Payra
                </text>
                <div className="bg-green-500 border rounded-full w-5 h-5 ml-2 mt-1"></div>
              </div>
              <text className="text-sm">eBiz-12029312391</text>
            </div>
          </div>
          <div className="px-3 flex flex-col py-3">
            <text className="font-bold text-lg">Personal Information</text>
            <div className="grid grid-cols-2">
              <div className="py-3">
                <text className="font-semibold text-sm">FIRST NAME</text>
              </div>
              <div>
                <text className="text-sm col-span-2">Clea Bernadette</text>
              </div>
              <div className="py-3">
                <text className="font-semibold text-sm">MIDDLE NAME</text>
              </div>
              <div>
                <text className="text-sm col-span-2">Domingo</text>
              </div>
              <div className="py-3">
                <text className="font-semibold text-sm">LAST NAME</text>
              </div>
              <div>
                <text className="text-sm col-span-2">Payra</text>
              </div>
              <div className="py-3">
                <text className="font-semibold text-sm">EMPLOYEE ID</text>
              </div>
              <div>
                <text className="text-sm col-span-2">eB1z-12029312391</text>
              </div>
              <div className="py-3">
                <text className="font-semibold text-sm">STREET ADDRESS</text>
              </div>
              <div>
                <text className="text-sm col-span-2">123 Tondo</text>
              </div>
              <div className="py-3">
                <text className="font-semibold text-sm">HIRE DATE</text>
              </div>
              <div>
                <text className="text-sm col-span-2">July 11, 2022</text>
              </div>
              <div className="py-3">
                <text className="font-semibold text-sm">SUBSIDIARY</text>
              </div>
              <div>
                <text className="text-sm col-span-2">eBizolution Inc.</text>
              </div>
              <div className="py-3">
                <text className="font-semibold text-sm">PHONE NUMBER</text>
              </div>
              <div>
                <text className="text-sm col-span-2">0932423423</text>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div
      className={`overflow-x-auto max-w-[90vw] ${
        minimize ? "xl:w-[88vw]" : "xl:w-[78vw]"
      } border relative shadow-md sm:rounded-lg`}
    >
      {typeof props.rows === "object" ? (
        <div>{showDetails()}</div>
      ) : (
        <div></div>
      )}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-neutral-50 bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500 uppercase">
          <tr>
            <th scope="col" className="py-1">
              <div className="flex justify-center items-center">
                <Checkbox
                  color={"orange"}
                  onChange={() => {
                    selectAllCheckboxes();
                  }}
                  checked={props.checkboxes.length > 0 ? true : false}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                  }}
                />
              </div>
            </th>
            {props.columns.map((col) => (
              <th
                key={col.name}
                scope="col"
                className="px-6 duration-150 max-w-[10rem] truncate"
              >
                {col.name}
              </th>
            ))}

            <th scope="col" className="p-4 text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {props.rows.map((row) => (
            <tr
              key={row.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => setIsVisible(true)}
            >
              <td className="p-2 w-4">
                <div className="flex justify-center items-center">
                  <Checkbox
                    value={row.id}
                    color={"orange"}
                    onChange={(e) => {
                      toggleCheckbox(Number(e.target.value));
                    }}
                    checked={
                      props.checkboxes.includes(row.id) ||
                      props.checkboxes.includes(-1)
                    }
                    classNames={{
                      input:
                        "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                    }}
                  />
                </div>
              </td>
              {Object.keys(row).map((key) => {
                return (
                  props.filterBy.includes(key) && (
                    <td className="py-2 px-6 max-w-[10rem] truncate">
                      {getProperty(key, row)}
                    </td>
                  )
                );
              })}

              <td className="space-x-2 text-center max-w-[10rem]">
                <i className="fa-light fa-pen-to-square" />
                <i className="text-red-500 fa-light fa-trash-can" />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
