import React from "react";
import { useFieldArray } from "react-hook-form";
import ProductSizesNestedFieldArray from "components/admin/ProductSizesNestedFieldArray";

export default function Fields({ control, register }) {
  const { fields } = useFieldArray({
    control,
    name: "sizes"
  });

  return (
    <div style={{overflowX: "scroll"}}> 
      <ul style={{listStyle: 'none', width: '100%', margin: 0, padding: 0}}> 
        {fields.map((item, index) => { 
          return (
            <li key={item.id} style={{listStyle: 'none', margin: '18px 0px', width: '100%', minWidth: '494px', padding: "5px 0px"}}>
{/*  
              <Controller
                name={`sizes[${index}].name`}
                control={control}
                defaultValue={item.name}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    xs="small"
                    style={{ width: 100, height: 40 }}
                    // disabled={true}
                    id={`(sizes[${index}].name)_${new Date().getTime()}`}
                    label={item.name}
                    // defaultValue={item.name}
                    // error={Boolean(errors.description)}
                    // helperText={errors.description ? 'Description is required' : ''}
                    {...field}
                  ></TextField>
                )}
              ></Controller> */}

              <ProductSizesNestedFieldArray nestIndex={index} {...{ control, register }} /> 
  
            </li>
          )
        })}
      </ul> 
    </div>

  );
}
