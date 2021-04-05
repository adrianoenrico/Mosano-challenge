import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles } from '@material-ui/core/styles'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
//Data
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'
import fetch from 'isomorphic-fetch'
//My comps
import Form from '../components/form'
import Table from '../components/table'

const link = createHttpLink({
  fetch,
  uri: 'https://us-central1-mosano.cloudfunctions.net/graphql',
})
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
})

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    minHeight: '100vh',
  },
  content: {
    paddingBottom: theme.spacing(3),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    height: theme.spacing(3),
    paddingRight: theme.spacing(2),
  },
}))

const IndexPage = () => {
  const classes = useStyles()
  //Bellow is a media query and overide for the materia-ui theme to check for the user's pref for dark/light mode. As if.
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  )
  return (
    <div>
      <Helmet>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>Hello there!</title>
      </Helmet>
      <main className={classes.container}>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={client}>
            <CssBaseline />
            <div className={classes.content}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs>
                  <Form />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Table />
                </Grid>
              </Grid>
              <div className={classes.footer}>
                <Typography align="right">Adriano Alecrim</Typography>
              </div>
            </div>
          </ApolloProvider>
        </ThemeProvider>
      </main>
    </div>
  )
}

export default IndexPage
