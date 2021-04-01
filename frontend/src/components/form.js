import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(2),
    },
    textField: {
     margin: theme.spacing(1)
    },
    btnContainer:{
        justifyContent: 'flex-end',
        display: 'flex',
        width: '100%',
        padding: theme.spacing(3,1,0,0)
    },
    errorMsg:{
        marginLeft: theme.spacing(1)
    },
  }));

  const mockupData = {
    countries: [
        {
            name: 'Alexandria'
        },
        {
            name: 'Jacksonville'
        }
    ]
  }
export default function Form() {
    const classes = useStyles()
    const { register, handleSubmit, control, watch, errors } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
            <TextField className={classes.textField} label='Name' name='name' placeholder='first name goes here' inputRef={register({required: true})} fullWidth />
            {errors.name && <Typography className={classes.errorMsg} variant='subtitle2' color='error'>A first name is required</Typography>}
            <TextField className={classes.textField} label='Surname' name='surname' placeholder='surname goes here' inputRef={register} fullWidth />
            <FormControl className={classes.textField} fullWidth>
                <InputLabel htmlFor="country-select">
                    Country
                </InputLabel>
                <Controller
                    name='country'
                    control={control}
                    rules={{required: true}}
                    defaultValue={''}
                    as={
                        <Select id='country-select' >
                            {mockupData.countries.map((option,i)=>(
                                <MenuItem key={`${option.name}-${i}`} value={option.name}>{option.name}</MenuItem>
                            ))}
                        </Select>
                    }
                />
            </FormControl>
            {errors.country && <Typography className={classes.errorMsg} variant='subtitle2' color='error'>Please select a country from the dropdown list</Typography>}
            <TextField className={classes.textField} label='Birthday' name='birthday' type='date' inputRef={register({required: true})} fullWidth InputLabelProps={{shrink: true}}/>
            {errors.birthday && <Typography className={classes.errorMsg} variant='subtitle2' color='error'>Please enter your birthday</Typography>}
            <div className={classes.btnContainer}>
                <Button className={classes.submitBtn} variant='contained' type='submit'>Save</Button>
            </div>
        </form>
    )
}

