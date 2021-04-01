import React,{ useMemo } from "react"
import { Helmet } from "react-helmet";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid'
import Form from '../components/form'


const IndexPage = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]);

  return (
    <div>
      <Helmet>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>Hello there!</title>
      </Helmet>
      <main>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid 
              item
              xs
            >
              <Form />
            </Grid>
          </Grid>
        </ThemeProvider>
      </main>
    </div>
  )
}

export default IndexPage
