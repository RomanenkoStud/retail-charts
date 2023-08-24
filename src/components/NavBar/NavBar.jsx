import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    MenuItem,
    Select,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

export const NavBar = ({ 
    pages,
    dropDownValues,
    selected,
    setSelected,
    onReset,
}) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerOpen(open);
    };

    const PageLinks = (
        <>
            {pages.map((page) => (
                <Link
                    key={page.title}
                    to={page.route} 
                    style={{ textDecoration: 'none' }}
                >
                    <ListItem>
                        <ListItemText 
                            primary={page.title} 
                            sx={{ color: '#fff' }}
                        />
                    </ListItem>
                </Link>
            ))}
        </>
    );

    const ResetButton = (
        <Button
            onClick={onReset}
            sx={{ color: '#fff' }}
        >
            Reset
        </Button>
    );

    const DropDownMenu = (
        <Select
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            sx={{ color: '#fff' }}
            variant='standard'
        >
            {dropDownValues.map((value, index) => (
                <MenuItem key={index} value={value}>
                    {value}
                </MenuItem>
            ))}
        </Select>
    );

    const DrawerMenu = (
        <>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <List  sx={{ background: '#5680ff', height: '100%', width: '250px'}}>
                    <ListItem>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Dashboard
                        </Typography>
                    </ListItem>
                    <Divider />
                    {PageLinks}
                </List>
            </Drawer>
        </>
    );

    return (
        <AppBar component="nav">
            <Toolbar>
                {isSmallScreen && DrawerMenu}
                <Box sx={{ flexGrow: 1 }}>
                    <Link
                        to="/"
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography 
                            variant="h6"
                            sx={{ color: '#fff' }}
                        >
                            Dashboard
                        </Typography>
                    </Link>
                </Box>
                {!isSmallScreen && PageLinks}
                <Box>
                    {DropDownMenu}
                    {ResetButton}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

NavBar.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            route: PropTypes.string.isRequired,
        })
    ).isRequired,
    dropDownValues: PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired,
    selected: PropTypes.string.isRequired,
    setSelected: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
};
