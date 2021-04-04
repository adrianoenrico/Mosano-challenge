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
import LinearProgress from '@material-ui/core/LinearProgress';
//Data
import { useQuery, gql, useMutation } from '@apollo/client';


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
    }
  }));

const GET_COUNTRIES = gql`
  query Countries {
      countries{
          name
      }
  }
`;
const ADD_BIRTHDAY = gql`
    mutation addBirthdayBoi($name: String!, $birthday: String!, $country: String!) {
        addBirthdayBoi(name: $name, birthday: $birthday, country: $country) {
            name
            birthday
            country
            _id
        }
    }
`;

export default function Form() {
    const classes = useStyles()
    const { register, handleSubmit, control, errors } = useForm();
    const { loading, error, data } = useQuery(
        GET_COUNTRIES,
        {
            pollInterval: 30000,
        }
    );
    const [addBirthdayBoi] = useMutation(ADD_BIRTHDAY, { 
        update(cache, { data: { addBirthdayBoi }}) {
            cache.modify({
                fields: {
                    birthdayBois(existingBois = []){
                        const newBoiRef = cache.writeFragment({
                            data: addBirthdayBoi,
                            fragment: gql`
                              fragment NewBoi on BirthdayBoi {
                                  _id
                                  name
                                  country
                                  birthday
                              }
                            `
                        });
                        return [...existingBois, newBoiRef]
                    }
                }
            })
        }
    });
    const onSubmit = data => {
        let birthday = new Date(data.birthday);
        addBirthdayBoi({
            variables:{
                name: `${data.name}${data.surname?' ' + data.surname:''}`,
                birthday: birthday.toLocaleDateString('en-US'),
                country: data.country
            }
        })
    }
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
                            {loading && 
                                <div className={classes.loadingItems}>
                                    <LinearProgress  />
                                    <Typography align='center' component='div'>Loading data...</Typography>
                                </div>
                            }
                            {data && data.countries.map((option,i)=>(
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
                <Button className={classes.submitBtn} variant='contained' color='primary' type='submit'>Save</Button>
            </div>
        </form>
    )
}

