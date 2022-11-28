import JsBarcode from 'jsbarcode';
import React, { useRef, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

const Barcode = () => {

  const testString = "arvae omsim"

  useEffect(() => {
    JsBarcode("#barcode2", testString, {
      textAlign: "center",
      textPosition: "bottom",
      fontOptions: "bold",
      fontSize: 16,
      textMargin: 6,
    });
  })

  const generateBarCode = (id: string) => {
    JsBarcode("#barcode2", "Hi!", {
      textAlign: "center",
      textPosition: "bottom",
      fontOptions: "bold",
      fontSize: 16,
      textMargin: 6,
    });
  }

  return (
    <DashboardLayout>
      <>
        <div>Barcode</div>
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        {/* <div ref={ref}></div> */}
        <svg id="barcode2"></svg>
      </>
    </DashboardLayout>
  )
}

export default Barcode