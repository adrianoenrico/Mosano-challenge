import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
//Data
import { useQuery, gql, useMutation } from '@apollo/client'
// Other
import Snack from './snack'
import { getAge } from '../utils'
// Date utils
import { compareAsc } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
  },
  btnContainer: {
    justifyContent: 'flex-end',
    display: 'flex',
    width: '100%',
    padding: theme.spacing(3, 1, 0, 0),
  },
}))

const GET_COUNTRIES = gql`
  query Countries {
    countries {
      name
    }
  }
`
const ADD_BIRTHDAY = gql`
  mutation addBirthdayBoi(
    $name: String!
    $birthday: String!
    $country: String!
  ) {
    addBirthdayBoi(name: $name, birthday: $birthday, country: $country) {
      name
      birthday
      country
      _id
    }
  }
`

export default function Form() {
  const classes = useStyles()
  const { register, handleSubmit, control, errors, reset } = useForm({ defaultValues: { birthday: new Date() } })
  const [snack, setSnack] = useState({
    open: false,
    message: '',
  })
  const { loading, data } = useQuery(GET_COUNTRIES, {
    pollInterval: 30000,
  })
  const [addBirthdayBoi] = useMutation(ADD_BIRTHDAY, {
    update(cache, { data: { addBirthdayBoi } }) {
      cache.modify({
        fields: {
          birthdayBois(existingBois = []) {
            const newBoiRef = cache.writeFragment({
              data: addBirthdayBoi,
              fragment: gql`
                fragment NewBoi on BirthdayBoi {
                  _id
                  name
                  country
                  birthday
                }
              `,
            })
            return [...existingBois, newBoiRef]
          },
        },
      })
    },
  })
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnack(false)
  }
  const onSubmit = (data) => {
    console.log(data);
    let birthday = new Date(data.birthday).toLocaleDateString('en-US')
    addBirthdayBoi({
      variables: {
        name: `${data.name}${data.surname ? ' ' + data.surname : ''}`,
        birthday: birthday,
        country: data.country,
      },
    })
    let age = getAge(birthday)
    let bday = new Date(data.birthday)
    setSnack({
      open: true,
      message: `
            Hello ${data.name} from ${data.country} on 
            ${bday.getDate()} of month
            ${bday.toLocaleDateString('en-US', { month: 'long' })} you will
            have ${age + 1}
          `,
    })
    reset()
  }
  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={errors.name}
          helperText={errors.name ? 'A first name is required' : false}
          className={classes.textField}
          label="Name"
          name="name"
          placeholder="first name goes here"
          inputRef={register({ required: true })}
          fullWidth
        />
        <TextField
          className={classes.textField}
          label="Surname"
          name="surname"
          placeholder="surname goes here"
          inputRef={register}
          fullWidth
        />
        <FormControl
          className={classes.textField}
          fullWidth
          error={errors.country}
        >
          <InputLabel htmlFor="country-select">Country</InputLabel>
          <Controller
            name="country"
            control={control}
            rules={{ required: true }}
            defaultValue={''}
            as={
              <Select id="country-select">
                {loading && (
                  <div className={classes.loadingItems}>
                    <LinearProgress />
                    <Typography align="center" component="div">
                      Loading data...
                    </Typography>
                  </div>
                )}
                {data &&
                  data.countries.map((option, i) => (
                    <MenuItem key={`${option.name}-${i}`} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
              </Select>
            }
          />
          {errors.country && (
            <FormHelperText>
              Please select a country from the dropdown list
            </FormHelperText>
          )}
        </FormControl>
        <Controller
          name="birthday"
          control={control}
          rules={{
            required: true, validate: (value) => {
              let res = compareAsc(new Date(), value)
              return res === 1 ? true : false
            }
          }}
          render={({ onChange, value, name }) =>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.textField}
                name={name}
                onChange={onChange}
                selected={value}
                value={value}
                format="MM/dd/yyyy"
                helperText="Dates past today won't be allowed"
                label="Birthday"
                fullWidth
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          }
        />
        <div className={classes.btnContainer}>
          <Button
            className={classes.submitBtn}
            variant="contained"
            color="primary"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
      <Snack
        open={snack.open}
        message={snack.message}
        handleClose={handleClose}
      />
    </>
  )
}
