import Layout from "../components/layout";
import {
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogContent,
  DialogActions,
  Fab,
  CircularProgress,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [platform, setPlatform] = useState("codeforces");
  const [username, setUsername] = useState<string>("");
  const [rival, setRival] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRating, setMaxRating] = useState<number>(4000);
  const [tagOption, setTagOption] = useState("and");
  const [tags, setTags] = useState({});
  const [tagList, setTagList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const url = "http://localhost:8000";

  const getTags = async () => {
    const response = await axios.get(url + "/codeforces-problem-tags");
    setTagList(response.data.problem_tags);
  };

  useEffect(() => {
    getTags();
  }, []);

  const pickTag = (key: any) => {
    const temp: any = { ...tags };
    temp[key] = 1;

    setTags(temp);
  };

  const removeTag = (key: any) => {
    const temp: any = { ...tags };
    delete temp[key];

    setTags(temp);
  };

  const tableClick = (url: string) => {
    window.open(url, "_blank");
  };

  const getProblems = async (data: any) => {
    try {
      const response = await axios.post(url + "/compare", data);
      setQuestionList(response.data.problems);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const search = () => {
    setQuestionList([]);
    setLoading(true);
    const tagParams = [];
    Object.keys(tags).map((key: any) => {
      tagParams.push(key);
    });

    const params = {
      online_judge: platform,
      handle: username,
      rival_handle: rival,
      filter: {
        rating: {
          minimum: minRating,
          maximum: maxRating,
        },
        tags: {
          mode: tagOption,
          values: tagParams,
        },
      },
    };
    getProblems(params);
  };

  const selectedTagsStyle =
    "bg-orange-600 hover:bg-orange-500 rounded-full px-2 py-1 cursor-pointer m-1 text-sm";
  const unselectedTagsStyle =
    "bg-gray-800 hover:bg-gray-700 rounded-full px-2 py-1 cursor-pointer m-1 text-sm";

  return (
    <Layout>
      <div className="flex justify-between">
        <div className="w-1/2">
          <div className="flex items-center my-3">
            <div className="w-40">Select Platform:</div>
            <FormControl size="small">
              <Select
                value={platform}
                onChange={(event: any) => {
                  setPlatform(event.target.value);
                }}
                variant="outlined"
                className="w-64"
              >
                <MenuItem value={"codeforces"}>Codeforces</MenuItem>
                <MenuItem value={"atcoder"}>Atcoder</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex items-center my-3">
            <div className="w-40">Your username:</div>
            <TextField
              className="w-64"
              variant="outlined"
              size="small"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
          </div>
          <div className="flex items-center my-3">
            <div className="w-40">Rival username:</div>
            <TextField
              className="w-64"
              variant="outlined"
              size="small"
              placeholder="Rival username"
              value={rival}
              onChange={(e) => setRival(e.currentTarget.value)}
            />
          </div>

          <div className="flex items-center my-3">
            <div className="w-40">Question rating:</div>
            <TextField
              className="w-24"
              type="number"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              inputProps={{
                step: 10,
                min: 0,
                max: 4000,
              }}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.currentTarget.value))}
            />
            <span className="w-16 flex justify-center">to</span>
            <TextField
              className="w-24"
              type="number"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              inputProps={{
                step: 10,
                min: 0,
                max: 4000,
              }}
              value={maxRating}
              onChange={(e) => setMaxRating(Number(e.currentTarget.value))}
            />
          </div>
          {platform === "codeforces" ? (
            <div>
              <div className="flex items-center my-3">
                <div className="w-40">Tag Option:</div>
                <FormControl component="fieldset">
                  <div className="flex items-center">
                    <div>
                      <RadioGroup
                        value={tagOption}
                        onChange={(event: any) =>
                          setTagOption(event.target.value)
                        }
                        row
                      >
                        <FormControlLabel
                          value="and"
                          control={<Radio color="primary" />}
                          label="AND"
                        />
                        <FormControlLabel
                          value="or"
                          control={<Radio color="primary" />}
                          label="OR"
                        />
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {tagOption === "and"
                      ? "Question must have all the selected tag(s)"
                      : "Question must have at least one of the selected tag(s)"}
                  </div>
                </FormControl>
              </div>
              <div>
                <div className="w-40 mb-3 mt-8">Select Problem tags</div>
                <div className="flex flex-wrap justify-between">
                  {tagList.map((data: any) => (
                    <div
                      key={data}
                      className={
                        tags[data] ? selectedTagsStyle : unselectedTagsStyle
                      }
                      onClick={
                        tags[data] ? () => removeTag(data) : () => pickTag(data)
                      }
                    >
                      {data}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-8 flex justify-end">
            <Button
              variant="outlined"
              onClick={search}
              disabled={!username || !rival}
            >
              Submit
            </Button>
          </div>
        </div>
        {questionList.length > 0 ? (
          <div className="w-1/2 px-6">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span className="font-semibold">Name</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">Rating</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">Tags</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questionList.map((row: any, index: number) => (
                    <TableRow
                      key={index}
                      onClick={() => tableClick(row.url)}
                      hover
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div>
                          <a href={row.url}>{row.name}</a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{row.rating}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {row.tags.length
                            ? row.tags.map((data: any) => (
                                <span
                                  key={data}
                                  className="text-xs bg-gray-800 rounded-full px-2 py-1 m-1"
                                >
                                  {data}
                                </span>
                              ))
                            : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : loading ? (
          <div className="w-1/2 px-6">
            <div className="flex justify-center h-screen items-center">
              <CircularProgress />
            </div>
          </div>
        ) : null}
      </div>
      <Fab
        style={{
          margin: 0,
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto",
          position: "fixed",
        }}
        variant="extended"
        onClick={() => setOpen(true)}
      >
        About
      </Fab>
      <Dialog open={open} onBackdropClick={() => setOpen(false)}>
        <DialogContent>
          {
            "This website is used to compare unsolved coding problem between user on website that hosts competitive programming contests"
          }
        </DialogContent>
        <div className="flex justify-center">
          <DialogActions>
            <Button
              type="submit"
              variant="outlined"
              className="focus:outline-none"
              onClick={() => setOpen(false)}
            >
              OK
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <Dialog open={error ? true : false} onBackdropClick={() => setError("")}>
        <DialogContent>{error}</DialogContent>
        <div className="flex justify-center">
          <DialogActions>
            <Button
              type="submit"
              variant="outlined"
              className="focus:outline-none"
              onClick={() => setError("")}
            >
              OK
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </Layout>
  );
}
