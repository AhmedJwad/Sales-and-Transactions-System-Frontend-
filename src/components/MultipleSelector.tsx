import { FC, useState, useEffect } from "react";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { MultipleSelectorModel } from "../types/MultipleSelectorModel";

interface Props {
  selected: MultipleSelectorModel[];
  nonSelected: MultipleSelectorModel[];
  onChange: (selected: MultipleSelectorModel[]) => void;
}

const MultipleSelector: FC<Props> = ({
  selected,
  nonSelected,
  onChange,
}) => {
  const [available, setAvailable] = useState<MultipleSelectorModel[]>([]);
  const [chosen, setChosen] = useState<MultipleSelectorModel[]>([]);

  // تحديث الحالتين عندما تتغير الـ props
  useEffect(() => {
    setAvailable(nonSelected);
    setChosen(selected);
  }, [nonSelected, selected]);

  const add = (item: MultipleSelectorModel) => {
    const newAvailable = available.filter((x) => x.key !== item.key);
    const newChosen = [...chosen, item];
    setAvailable(newAvailable);
    setChosen(newChosen);
    onChange(newChosen);
  };

  const remove = (item: MultipleSelectorModel) => {
    const newChosen = chosen.filter((x) => x.key !== item.key);
    const newAvailable = [...available, item];
    setAvailable(newAvailable);
    setChosen(newChosen);
    onChange(newChosen);
  };

  const addAll = () => {
    const all = [...chosen, ...available];
    setChosen(all);
    setAvailable([]);
    onChange(all);
  };

  const removeAll = () => {
    const back = [...available, ...chosen];
    setAvailable(back);
    setChosen([]);
    onChange([]);
  };

  return (
    <Grid container spacing={2}>
      {/* Available List */}
      <Grid size={{xs:5}}>
        <Typography variant="subtitle2" gutterBottom>
          Available
        </Typography>
        <Paper variant="outlined" sx={{ height: 200, overflow: "auto" }}>
          <List dense>
            {available.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton onClick={() => add(item)}>
                  <ListItemText primary={item.value} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Buttons */}
      <Grid
        size={{xs:2}}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid>
          <Button variant="outlined" onClick={addAll}>
            &gt;&gt;
          </Button>
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={removeAll}>
            &lt;&lt;
          </Button>
        </Grid>
      </Grid>

      {/* Selected List */}
      <Grid size={{xs:5}}>
        <Typography variant="subtitle2" gutterBottom>
          Selected
        </Typography>
        <Paper variant="outlined" sx={{ height: 200, overflow: "auto" }}>
          <List dense>
            {chosen.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton onClick={() => remove(item)}>
                  <ListItemText primary={item.value} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MultipleSelector;
