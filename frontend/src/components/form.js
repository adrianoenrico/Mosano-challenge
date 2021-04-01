import React from 'react'
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'


const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(2),
      justifyContent: 'flex-end'
    },
    textField: {
     margin: theme.spacing(1)
    },
    submitBtn:{
        margin: theme.spacing(3)
    }
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
            <TextField className={classes.textField} label='Name' name='name' placeholder='first name goes here' inputRef={register({required: true})} fullWidth/>
            <TextField className={classes.textField} label='Surname' name='surname' placeholder='surname goes here' inputRef={register} fullWidth/>
            <Button className={classes.submitBtn} variant='contained' type='submit'>Save</Button>
        </form>
    )
}