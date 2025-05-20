import React, { useEffect, useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import { trpc } from "../../utils/trpc"
import { AssetType } from "../../types/generic"
import { useRouter } from "next/router"
import { useSearchStore } from "../../store/useStore"


const Dashboard = () => {
    return (
        <DashboardLayout>
            <section>
                <p></p>
            </section>
        </DashboardLayout>
        
    )
}