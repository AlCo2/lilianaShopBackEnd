import { Box, List, Button, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, Menu, MenuItem, Paper, Pagination, PaginationItem } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CgSortAz } from "react-icons/cg";
import SuggestionCard from './components/SuggestionCard';
import { BiSearch } from 'react-icons/bi';
import { RiArrowUpDownFill } from 'react-icons/ri';
import Layout from '@/Layout';
import { Link, router } from '@inertiajs/react';

const SortMenu = ({selectedSort, setselectedSort}) =>{
  const [anchorEl, setAnchorEl] = useState(null);
  const options = [
    'Best Match',
    'Price Low - High',
    'Price High - Low',
    'Newest',
  ];
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setselectedSort(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper' }}
      >
        <IconButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <RiArrowUpDownFill className='text-sm'/>
        </IconButton>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedSort}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

const CategoryMenu = ({category_list, categories, handleSelectAllChange, handleCheckboxChange}) =>{
  return (
        <List
          id="basic-menu"
        >
          <FormControlLabel className='pl-2' control={<Checkbox onChange={handleSelectAllChange}/>} label="All" />
          <FormGroup className='pl-5'>
                {category_list.map(category=>(
                    <FormControlLabel key={category.id} control={<Checkbox checked={categories.includes(category.id)} size='small' onChange={handleCheckboxChange(category.id)} />} label={category.name} />  
                ))}
          </FormGroup>
        </List>
  )
}

const FilterMenu = ({category_list, categories, handleSelectAllChange, handleCheckboxChange}) =>{
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
      id="demo-positioned-button"
      aria-controls={open ? 'demo-positioned-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
      >
        <CgSortAz className='text-xl'/>
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        <div className='w-52'>
          <Container>
            <Grid container>
              <Grid item xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <p className='font-Poppins'>Filters</p>
                <Button variant='text' size='small' className='text-xs text-liliana-secondary'>Clear ALL</Button>
              </Grid>
              <Grid item xs={12} my={1}>
                <label className='relative'>
                  <BiSearch className='absolute top-0 right-2'/>
                  <input type="text" placeholder='Search' className='border h-8 focus:outline-blue-400 p-1 text-sm w-full' name="" id="" />
                </label>
              </Grid>
              <Grid item xs={12}>
                <p className='font-Poppins'>Categories</p>
              </Grid>
              <Grid item xs={12}>
                <CategoryMenu category_list={category_list} categories={categories} handleSelectAllChange={handleSelectAllChange} handleCheckboxChange={handleCheckboxChange}/>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Menu>
    </div>
  );
}

const store = ({products, category_list, filter, sort}) => {
  const [page, setPage] = useState(products.current_page);
  const convertedData = filter.map(item => Number(item));
  const [categories, setCategories] = useState(convertedData);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSort, setselectedSort] = useState(Number(sort));
  const [anchorEl, setAnchorEl] = useState(null);
  const isFirstRender = useRef(true);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (categories.length>0){
      setCategories([]);
    }
    else
    {
      setCategories(category_list.map(category => category.id))
    }
  };

  const handleCheckboxChange = (id) => (e) => {
    if(categories.includes(id))
    {
      setCategories(categories.filter(category_id=> category_id !== id));
    }
    else
    {
      setCategories(categories => [...categories, id]);
    }
  };

  const handlePageChange = (e, value) =>{
    setPage(value);
  }
  useEffect(()=>{
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if(selectedSort>0)
      router.get('/store', { filter:categories, sort: selectedSort});
    else
      router.get('/store', { filter:categories});
  }, [categories, selectedSort])
  
  return (
    <>
      <div className='min-h-screen pt-5 bg-liliana-background'>
        <Container>
          <Grid container columns={12} justifyContent={'center'} gap={2}>
            <Grid xs={2} item className='max-xl:hidden'>
              <Paper className='p-5 rounded-md'>
                <p className='font-bold'>categories</p>
                <FormControlLabel control={<Checkbox onChange={handleSelectAllChange}/>} checked={categories.length===category_list.length} label="All" />
                <FormGroup className='pl-5'>
                  {category_list.map(category=>(
                    <FormControlLabel key={category.id} control={<Checkbox checked={categories.includes(category.id)} size='small' onChange={handleCheckboxChange(category.id)} />} label={category.name} />  
                  ))}
                </FormGroup>
              </Paper>
            </Grid>
            <Grid md={9} item>
              <Paper className='p-5 pb-1 rounded-md'>
                <Grid container alignItems={'center'} justifyContent={'space-between'}>
                  <Grid item>
                    <p className='font-bold text-sm opacity-70'>{products.total} Items</p>
                  </Grid>
                  <Grid item display={'flex'} alignItems={'center'} gap={2}>
                    <Box display={'flex'} alignItems={'center'}>
                      <p className='text-sm'>Filter</p>
                      <FilterMenu category_list={category_list} categories={categories} handleCheckboxChange={handleCheckboxChange} handleSelectAllChange={handleSelectAllChange} />
                      <p className='text-sm'>Sort</p>
                      <SortMenu selectedSort={selectedSort} setselectedSort={setselectedSort}/>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              <Grid container gap={1} marginY={5} justifyContent={{xs:'center'}} mt={2}>
                { products.data.map((product)=>(
                  <SuggestionCard key={product.id} id={product.id} title={product.title} image={product.images[0].url} price={product.price}/>
                ))
                }
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{display:'flex', justifyContent:'center'}}>
            <Pagination onChange={handlePageChange}
              renderItem={(item) =>(
              <PaginationItem
                component={Link}
                href={categories.length>0?window.location.href +'&page='+item.page:'/store?page='+item.page +(selectedSort>0?'&sort='+selectedSort:'')}
                {...item}
              />
            )} 
            count={products.last_page}
            page={page} 
            sx={{py:5}}/>
          </Box>
        </Container>
      </div>
    </>
  )
}

store.layout = page => <Layout children={page} title="Store" />
export default store;