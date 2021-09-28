import { TextField } from "@material-ui/core";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";

const ProductSizeNestedFieldArray = ({ nestIndex, control, register }) => {
  // console.log("ProductSizeNestedFieldArray.js nestIndex object:", nestIndex);
  const { fields } = useFieldArray({
    control,
    name: `sizes[${nestIndex}].nestedArray`
  });

  const checkFieldValueToDisable = (fieldValue) => {
    const val = fieldValue.toString().trim();
    if (val === 'XS' || val === 'S' || val === 'M' || val === 'L' 
        || val === 'XL' || val === 'XXL' || val === 'Select') {
      return true;
    } else { return false; } 
  };

  return (
    <>
      {fields.map((item, k) => {        
        return (          
          <span key={item.id} style={{height: 40, marginLeft: 0 }}>
            <Controller
              name={`sizes[${nestIndex}].nestedArray[${k}].field1`}
              control={control}
              defaultValue={item.field1}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  xs="small"
                  {...register(`sizes[${nestIndex}].nestedArray[${k}].field1`, { required: true })}
                  style={{ width: "13%", minWidth: "54px", maxWidth: "100px", height: 40 }}
                  disabled={checkFieldValueToDisable(item.field1)}
                  id={`(sizes[${nestIndex}].nestedArray[${k}].field1)_${new Date().getTime()}`}
                  label={item.field1}
                  // defaultValue={item.field1}
                  // error={Boolean(errors.description)}
                  // helperText={errors.description ? 'Description is required' : ''}
                   onChange={(e) => field.onChange(parseInt(e.target.value))}
                  {...field}
                ></TextField>
              )}
            ></Controller>

            <Controller
              name={`sizes[${nestIndex}].nestedArray[${k}].field2`}
              control={control}
              defaultValue={item.field2}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  xs="small"
                  {...register(`sizes[${nestIndex}].nestedArray[${k}].field2`, { required: true })}
                  style={{ width: "13%", minWidth: "54px", maxWidth: "100px", height: 40 }}
                  disabled={checkFieldValueToDisable(item.field2)}
                  id={`(sizes[${nestIndex}].nestedArray[${k}].field2)_${new Date().getTime()}`}
                  label={item.field2}
                  // defaultValue={item.field1}
                  // error={Boolean(errors.description)}
                  // helperText={errors.description ? 'Description is required' : ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  {...field}
                ></TextField>
              )}
            ></Controller>                    

            <Controller
              name={`sizes[${nestIndex}].nestedArray[${k}].field3`}
              control={control}
              defaultValue={item.field3}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  xs="small"
                  {...register(`sizes[${nestIndex}].nestedArray[${k}].field3`, { required: true })}
                  style={{ width: "13%", minWidth: "54px", maxWidth: "100px", height: 40 }}
                  disabled={checkFieldValueToDisable(item.field3)}
                  id={`(sizes[${nestIndex}].nestedArray[${k}].field3)_${new Date().getTime()}`}
                  label={item.field3}
                  // defaultValue={item.field1}
                  // error={Boolean(errors.description)}
                  // helperText={errors.description ? 'Description is required' : ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  {...field}
                ></TextField>
              )}
            ></Controller>                    
            <Controller
              name={`sizes[${nestIndex}].nestedArray[${k}].field4`}
              control={control}
              defaultValue={item.field4}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  xs="small"
                  {...register(`sizes[${nestIndex}].nestedArray[${k}].field4`, { required: true })}
                  style={{ width: "13%", minWidth: "54px", maxWidth: "100px", height: 40 }}
                  disabled={checkFieldValueToDisable(item.field4)}
                  id={`(sizes[${nestIndex}].nestedArray[${k}].field4)_${new Date().getTime()}`}
                  label={item.field4}
                  // defaultValue={item.field1}
                  // error={Boolean(errors.description)}
                  // helperText={errors.description ? 'Description is required' : ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  {...field}
                ></TextField>
              )}
            ></Controller>                    
            <Controller
              name={`sizes[${nestIndex}].nestedArray[${k}].field5`}
              control={control}
              defaultValue={item.field5}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  xs="small"
                  {...register(`sizes[${nestIndex}].nestedArray[${k}].field5`, { required: true })}
                  style={{ width: "13%", minWidth: "54px", maxWidth: "100px", height: 40 }}
                  disabled={checkFieldValueToDisable(item.field5)}
                  id={`(sizes[${nestIndex}].nestedArray[${k}].field5)_${new Date().getTime()}`}
                  label={item.field5}
                  // defaultValue={item.field1}
                  // error={Boolean(errors.description)}
                  // helperText={errors.description ? 'Description is required' : ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  {...field}
                ></TextField>
              )}
            ></Controller>                    
            <Controller
              name={`sizes[${nestIndex}].nestedArray[${k}].field6`}
              control={control}
              defaultValue={item.field6}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  xs="small"
                  {...register(`sizes[${nestIndex}].nestedArray[${k}].field6`, { required: true })}
                  style={{ width: "13%", minWidth: "54px", maxWidth: "100px", height: 40 }}
                  disabled={checkFieldValueToDisable(item.field6)}
                  id={`(sizes[${nestIndex}].nestedArray[${k}].field6)_${new Date().getTime()}`}
                  label={item.field6}
                  // defaultValue={item.field1}
                  // error={Boolean(errors.description)}
                  // helperText={errors.description ? 'Description is required' : ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  {...field}
                ></TextField>
              )}
            ></Controller>                    
            <Controller
              name={`sizes[${nestIndex}].nestedArray[${k}].field7`}
              control={control}
              defaultValue={item.field7}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  xs="small"
                  {...register(`sizes[${nestIndex}].nestedArray[${k}].field7`, { required: true })}
                  style={{ width: "13%", minWidth: "54px", maxWidth: "100px", height: 40 }}
                  disabled={checkFieldValueToDisable(item.field7)}
                  id={`(sizes[${nestIndex}].nestedArray[${k}].field7)_${new Date().getTime()}`}
                  label={item.field7}
                  // defaultValue={item.field1}
                  // error={Boolean(errors.description)}
                  // helperText={errors.description ? 'Description is required' : ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  {...field}
                ></TextField>
              )}
            ></Controller>                    

          </span>
        );
      })}
    </>
  );
};

export default ProductSizeNestedFieldArray;
