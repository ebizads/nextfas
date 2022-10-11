import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Select, Popover, Checkbox, Pagination } from "@mantine/core";
import { ColumnType, RowType } from "../types/table";
import AssetTable from "../components/atoms/table/AssetTable";
import { trpc } from "../utils/trpc";
import DisplayAssets from "../components/asset/DisplayAssets";

const Assets = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Get asset by asset id
  const { data } = trpc.asset.findAll.useQuery({
    limit,
    page,
  });

  const [assets, setAssets] = useState<RowType[]>([]);
  const [accessiblePage, setAccessiblePage] = useState<number>(0);
  const [togglePage, setTogglePage] = useState<boolean>(true);

  useEffect(() => {
    //get and parse all data
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
      setAccessiblePage(Math.ceil(data?.total / limit));
    }
  }, [data]);

  return (
    <DashboardLayout>
      {/* <pre>{JSON.stringify(assets, null, 2)}</pre> */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Assets</h3>
        {togglePage ? (
          <DisplayAssets
            total={data?.total ?? 0}
            assets={assets}
            accessiblePage={accessiblePage}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            setTogglePage={setTogglePage}
          />
        ) : (
          <div>Create</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Assets;
