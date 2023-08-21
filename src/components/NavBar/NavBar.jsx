import PropTypes from 'prop-types';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    MenuItem,
    Select,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../baseUrl';

export const NavBar = ({ 
    pages,
    dropDownValues,
    selected,
    setSelected,
    onReset,
}) => {

    const PageLinks = () => (
        <>
            {pages.map((page) => (
                <Link
                    key={page.title}
                    to={page.route} 
                    style={{ textDecoration: 'none' }}
                >
                    <Button
                        sx={{ color: '#fff' }}
                    >
                        {page.title}
                    </Button>
                </Link>
            ))}
        </>
    );

    const ResetButton = () => (
        <Button
            onClick={onReset}
            sx={{ color: '#fff' }}
        >
            Reset
        </Button>
    );

    const DropDownMenu = () => (
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

    return (
        <AppBar component="nav">
            <Toolbar>
                <Link
                    to={baseUrl}
                    style={{ flexGrow: 1, textDecoration: 'none' }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: '#fff' }}
                    >
                        Dashboard
                    </Typography>
                </Link>
                <Box>
                    <DropDownMenu/>
                    <PageLinks/>
                    <ResetButton/>
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
