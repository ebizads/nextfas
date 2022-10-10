import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Select, Popover, Checkbox } from "@mantine/core";
import { ColumnType, RowType } from "../types/table";
import AssetTable from "../components/atoms/table/AssetTable";
import { trpc } from "../utils/trpc";

type SearchType = {
  value: string;
  label: string;
};

const Search = (props: { data: SearchType[] }) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Select
      value={value}
      placeholder="Search"
      searchable
      nothingFound={`Cannot find option`}
      onChange={setValue}
      clearable
      data={[...props.data]}
      icon={<i className="fa-solid fa-magnifying-glass text-xs"></i>}
    />
  );
};

// const assets = [
//   {
//     id: 1,
//     serial_number: "omsim123",
//     bar_code: "qweqweqweqweqweqweqweqwe",
//     type: "Laptop",
//     category: "Gadget",
//     name: "Mac OS",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Kevin the Rat",
//     added_date: "08/22/22 (9:05 am)",
//   },
//   {
//     id: 2,
//     serial_number: "omsim345",
//     bar_code: "wawawawawawa",
//     type: "Printer",
//     category: "Office Items",
//     name: "Expensive Printer",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Klarky Wahaha",
//     added_date: "08/23/22 (10:06 am)",
//   },
//   {
//     id: 3,
//     serial_number: "omsim678",
//     bar_code: "bwahahahahahaha",
//     type: "Office Chair",
//     category: "Office Items",
//     name: "Wheel Chair",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Johnny Allen",
//     added_date: "08/19/22 (11:05 pm)",
//   },
//   {
//     id: 4,
//     serial_number: "omsim696",
//     bar_code: "ediwowhaha",
//     type: "Water Dispenser",
//     category: "Office Items",
//     name: "Super Tubig",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Franz Arvae",
//     added_date: "08/10/22 (12:05 pm)",
//   },
//   {
//     id: 5,
//     serial_number: "omsim420",
//     bar_code: "opopoopopopop",
//     type: "Coffee Maker",
//     category: "Office Items",
//     name: "Bitter Coffee",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Franz Arvae",
//     added_date: "08/15/22 (1:05 pm)",
//   },
//   {
//     id: 6,
//     serial_number: "omsim123",
//     bar_code: "qweqweqweqweqweqweqweqwe",
//     type: "Laptop",
//     category: "Gadget",
//     name: "Mac OS",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Kevin the Rat",
//     added_date: "08/22/22 (9:05 am)",
//   },
//   {
//     id: 7,
//     serial_number: "omsim345",
//     bar_code: "wawawawawawa",
//     type: "Printer",
//     category: "Office Items",
//     name: "Expensive Printer",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Klarky Wahaha",
//     added_date: "08/23/22 (10:06 am)",
//   },
//   {
//     id: 8,
//     serial_number: "omsim678",
//     bar_code: "bwahahahahahaha",
//     type: "Office Chair",
//     category: "Office Items",
//     name: "Wheel Chair",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Johnny Allen",
//     added_date: "08/19/22 (11:05 pm)",
//   },
//   {
//     id: 9,
//     serial_number: "omsim696",
//     bar_code: "ediwowhaha",
//     type: "Water Dispenser",
//     category: "Office Items",
//     name: "Super Tubig",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Franz Arvae",
//     added_date: "08/10/22 (12:05 pm)",
//   },
//   {
//     id: 10,
//     serial_number: "omsim420",
//     bar_code: "opopoopopopop",
//     type: "Coffee Maker",
//     category: "Office Items",
//     name: "Bitter Coffee",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nostrum nemo, iste quas fuga totam, incidunt qui repudiandae placeat facilis atque animi eligendi exercitationem sequi inventore vel et laudantium omnis.",
//     owner: "Franz Arvae",
//     added_date: "08/15/22 (1:05 pm)",
//   },
// ] as RowType[];

const columns = [
  { value: "serial_number", name: "Serial No." },
  { value: "bar_code", name: "Bar Code" },
  { value: "type", name: "Type" },
  { value: "category", name: "Category" },
  { value: "name", name: "Name" },
  { value: "description", name: "Description" },
  { value: "owner", name: "Owner" },
  { value: "added_date", name: "Added Date" },
] as ColumnType[];

const showAssetsBy = [5, 10, 20, 50];

const FilterPopover = (props: {
  openPopover: boolean;
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>;
  filterBy: string[];
  setFilterBy: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <Popover
      opened={props.openPopover}
      onClose={() => props.setOpenPopover(false)}
      trapFocus={false}
      position="bottom"
      zIndex={10}
      classNames={{
        dropdown: "p-0 w-80 rounded-md shadow-lg",
      }}
    >
      <Popover.Target>
        <button
          onClick={() => {
            props.setOpenPopover(!props.openPopover);
          }}
          className="group flex w-7 gap-2 rounded-md bg-tangerine-500 p-2 text-xs  text-neutral-50 outline-none transition-width duration-200 hover:w-16 hover:bg-tangerine-400 focus:outline-none"
        >
          <i className="fa-regular fa-bars-filter text-xs" />
          <span className="invisible group-hover:visible">Filter</span>
        </button>
      </Popover.Target>{" "}
      <Popover.Dropdown>
        <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
        <div className="px-4 py-2">
          <Checkbox.Group
            orientation="vertical"
            description="Filter by"
            value={props.filterBy}
            onChange={props.setFilterBy}
          >
            <div className="grid grid-cols-2 gap-2">
              {columns.map((col) => (
                <Checkbox
                  color={"orange"}
                  key={col.name}
                  disabled={
                    props.filterBy.length === 1 &&
                    props.filterBy.includes(col.value)
                      ? true
                      : false
                  }
                  value={col.value}
                  label={col.name}
                  classNames={{
                    input:
                      "border-2 border-neutral-400 checked:bg-tangerine-500 checked:bg-tangerine-500 focus:outline-none outline-none",
                  }}
                />
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
const PaginationPopover = (props: {
  paginationPopover: boolean;
  setPaginationPopover: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <Popover
      opened={props.paginationPopover}
      onClose={() => props.setPaginationPopover(false)}
      trapFocus={false}
      position="top"
      zIndex={10}
      classNames={{
        dropdown: "p-0 rounded-md shadow-lg",
      }}
    >
      <Popover.Target>
        <button
          onClick={() => {
            props.setPaginationPopover(!props.paginationPopover);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-tangerine-300 to-tangerine-500 py-1 px-3 text-neutral-50"
        >
          <p className="font-medium">{props.limit}</p>
          <i className="fa-regular fa-chevron-down" />
        </button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="h-2 rounded-t-md bg-gradient-to-r from-tangerine-500 via-tangerine-300 to-tangerine-500"></div>
        <ul className="px-4 py-2">
          {showAssetsBy.map((i) => (
            <li
              key={i}
              className="cursor-pointer hover:bg-tangerine-50"
              onClick={() => {
                props.setLimit(i);
                props.setPage(1);
              }}
            >
              {i}
            </li>
          ))}
        </ul>
      </Popover.Dropdown>
    </Popover>
  );
};

const PageNumber = (props: { accessiblePage: number[] }) => {
  return (
    <div className="flex items-center gap-4">
      <button className="text-light-muted">Previous</button>
      {props.accessiblePage?.map((page) => (
        <button
          key={page}
          className="h-8 w-8 rounded-md bg-tangerine-400 text-center font-medium text-neutral-50 hover:bg-tangerine-500 hover:text-neutral-50 "
        >
          {page}
        </button>
      ))}
      <button className="outline-none hover:underline focus:outline-none">
        Next
      </button>
    </div>
  );
};

const Assets = () => {
  const [checkboxes, setCheckboxes] = useState<number[]>([]);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [paginationPopover, setPaginationPopover] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<string[]>([
    ...columns.map((i) => i.value),
  ]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Get asset by asset id
  const { data } = trpc.asset.findAll.useQuery({
    limit,
    page,
  });

  const [assets, setAssets] = useState<RowType[]>([]);
  const [accessiblePage, setAccessiblePage] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      const asset_array = [] as RowType[];
      data.assets.map((a) => {
        const asset = {
          id: a.id,
          serial_number: a.number ?? "ser123",
          bar_code: "bar123",
          type: a.type?.name ?? "",
          category: a.category?.name ?? "",
          name: a.name,
          description: a.description,
          owner: a.custodian?.name ?? "Arvae",
          added_date: a.createdAt.toISOString(),
        } as RowType;
        asset_array.push(asset);
      });
      setAssets(asset_array);

      //generate accessible page
      const accPage = Array.from(
        { length: Math.ceil(data?.total / limit) },
        (_, i) => i + 1
      );
      setAccessiblePage(accPage);
    }
  }, [data]);

  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(assets, null, 2)}</pre> */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Assets</h3>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex w-fit items-center gap-2">
                <div className="flex-1">
                  <Search
                    data={[
                      ...assets?.map((obj) => {
                        return { value: obj.serial_number, label: obj.name };
                      }),
                    ]}
                  />
                </div>
                <FilterPopover
                  openPopover={openPopover}
                  setOpenPopover={setOpenPopover}
                  filterBy={filterBy}
                  setFilterBy={setFilterBy}
                />
              </div>
              {checkboxes.length > 0 && (
                <button className="flex gap-2 rounded-md p-2 text-xs font-medium  text-red-500 underline underline-offset-4 outline-none focus:outline-none">
                  {checkboxes.includes(-1)
                    ? `Delete all record/s ( ${assets.length} ) ?`
                    : `Delete selected record/s ( ${checkboxes.length} )`}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex gap-2 rounded-md bg-tangerine-500 py-2 px-4 text-xs text-neutral-50 outline-none hover:bg-tangerine-600 focus:outline-none">
                <i className="fa-solid fa-print text-xs" />
                Print CVs
              </button>
              <button className="flex gap-2 rounded-md border-2 border-tangerine-500 py-2 px-4 text-center text-xs font-medium text-tangerine-600 outline-none hover:bg-tangerine-200 focus:outline-none">
                <i className="fa-regular fa-plus text-xs" />
                Add New
              </button>
            </div>
          </div>
          <AssetTable
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
            rows={assets}
            filterBy={filterBy}
            columns={columns.filter((col) => filterBy.includes(col.value))}
          />
        </section>
        <section className="mt-8 flex justify-between px-4">
          <div className="flex items-center gap-2">
            <p>Showing </p>
            <PaginationPopover
              paginationPopover={paginationPopover}
              setPaginationPopover={setPaginationPopover}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
            <p> of {data?.total} entries</p>
          </div>
          <PageNumber accessiblePage={accessiblePage} />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Assets;
