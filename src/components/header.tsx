import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar color="inherit" position="fixed" className={classes.appBar}>
      <Toolbar>
        <a href="/">
          <div className="flex items-center">
            <span className="text-xl font-semibold">CP Helper</span>
          </div>
        </a>
      </Toolbar>
    </AppBar>
  );
}
