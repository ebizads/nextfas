import React, { useState } from 'react'
import {Select} from '@mantine/core'

type SearchType = {
  value: string
  label: string
}

const Search = (props: { data: SearchType[] }) => {
  const [value, setValue] = useState<string | null>(null)
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
  )
}


export default Search