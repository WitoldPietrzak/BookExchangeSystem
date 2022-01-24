import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert, Button, Modal, Offcanvas, Table} from "react-bootstrap";
import Cookies from "js-cookie";
import './BookList.css';
import RefreshIcon from '../../Resources/refresh.png';
import Form from "react-bootstrap/Form";
import Icon from '../../Resources/pin.svg';
import Map from '../../Resources/map.png';
import MapPicker from 'react-google-map-picker'
import {makeAuthorListRequest} from "../../Requests/moks/AuthorListRequest";
import {makeGenreListRequest} from "../../Requests/moks/GenreListRequest";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import i18n from "i18next";
import {makeBookListRequest, makeFilteredBookListRequest} from "../../Requests/moks/BookListRequest";

class BookListNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            authors: [],
            genres: [],
            title:'',
            selectedGenres: [],
            selectedAuthor: '',
            selectedYearBefore: "",
            selectedYearAfter: "",
            selectedCopyCount: "",
            copyCount: "",
            requestError: false,
            message: '',
            showFilter: false,
            doFilter: false,
            filterErrors: {},
            button: 'Form.Filter',
            sortBy: 'titleUp',

        };
    }

    componentDidMount() {

        this.makeRequest();
    }

    showFilter() {
        this.setState({
            showFilter: true
        });
    }

    hideFilter() {
        this.setState({
            showFilter: false
        });
    }
    makeRequest() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAuthorListRequest(token, this);
        makeGenreListRequest(token, this);
        this.state.doFilter ? makeFilteredBookListRequest(token, this.state.title, this.state.selectedAuthor !== undefined ? this.state.selectedAuthor.id:null, this.state.selectedGenres.map(genre => {
            return genre.id
        }), this.state.selectedYearBefore, this.state.selectedYearAfter, this.state.selectedCopyCount, this) : makeBookListRequest(token, this)
    }

    reloadTable() {
        this.makeRequest();
    }

    renderRow(row) {
        const {t} = this.props;
        return (
            <tr className={'accountRow'} onClick={() => {
                window.location.hash = `#/books/${row.id}`;
                window.location.reload();
            }}>
                <td>{row.title}</td>
                <td>{`${row.author.name} ${row.author.surname}`}</td>
                <td>{row.releaseDate}</td>
                <td>{row.genres.map(genre => {
                    return `${genre.name[i18n.language] ? genre.name[i18n.language] : genre.nameCode}`
                }).toString()}</td>
                <td>{row.copyCount}</td>
            </tr>)
    }

    renderRows() {
        const rows = this.state.books;
        if (this.state.sortBy === "titleUp") {
            rows.sort((a, b) => {
                return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : (b.title.toLowerCase() > a.title.toLowerCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "titleDown") {
            rows.sort((a, b) => {
                return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : (b.title.toLowerCase() < a.title.toLowerCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "authorSurnameUp") {
            rows.sort((a, b) => {
                return a.author.surname.toLowerCase() > b.author.surname.toLowerCase() ? 1 : (b.author.surname.toLowerCase() > a.author.surname.toLowerCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "authorSurnameDown") {
            rows.sort((a, b) => {
                return a.author.surname.toLowerCase() < b.author.surname.toLowerCase() ? 1 : (b.author.surname.toLowerCase() < a.author.surname.toLowerCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "authorNameUp") {
            rows.sort((a, b) => {
                return a.author.name.toLowerCase() > b.author.name.toLowerCase() ? 1 : (b.author.name.toLowerCase() > a.author.name.toLowerCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "authorNameDown") {
            rows.sort((a, b) => {
                return a.author.name.toLowerCase() < b.author.name.toLowerCase() ? 1 : (b.author.name.toLowerCase() < a.author.name.toLowerCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "releaseYearUp") {
            rows.sort((a, b) => {
                return a.releaseDate > b.releaseDate ? 1 : (b.releaseDate > a.releaseDate ? -1 : 0)

            });
        }
        if (this.state.sortBy === "releaseYearDown") {
            rows.sort((a, b) => {
                return a.releaseDate < b.releaseDate ? 1 : (b.releaseDate < a.releaseDate ? -1 : 0)

            });
        }
        if (this.state.sortBy === "copyCountUp") {
            rows.sort((a, b) => {
                return a.copyCount > b.copyCount ? 1 : (b.copyCount > a.copyCount ? -1 : 0)

            });
        }
        if (this.state.sortBy === "copyCountDown") {
            rows.sort((a, b) => {
                return a.copyCount < b.copyCount ? 1 : (b.copyCount < a.copyCount ? -1 : 0)

            });
        }


        return rows.map(row => this.renderRow(row));

    }

    handleFilter() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if (this.state.title || this.state.selectedGenres.length > 0 || this.state.selectedAuthor || this.state.selectedYearBefore || this.state.selectedYearAfter|| this.state.selectedCopyCount) {
            this.setState({
                doFilter: true
            });
            makeFilteredBookListRequest(token, this.state.title, this.state.selectedAuthor ? this.state.selectedAuthor.id:null, this.state.selectedGenres.map(genre => {
                return genre.id
            }), this.state.selectedYearBefore, this.state.selectedYearAfter, this.state.selectedCopyCount, this)
        }
        this.hideFilter();

    }

    displayFilterInfo() {
        const {t} = this.props;
        return (<Fragment>
            <div>{t('Filter.ActiveFilters')}:</div>
            <div className={'activeFilters mt-0 mb-0 m-5'}>
                {this.state.title ?
                    <Button variant={'outline-dark'}>{t('Book.title')}={this.state.title}</Button> : ''}
                {this.state.selectedAuthor ?
                    <Button variant={'outline-dark'}>{t('Book.author')}={`${this.state.selectedAuthor.name} ${this.state.selectedAuthor.surname}`}</Button> : ''}
                {this.state.selectedGenres.length > 0 ?
                    <Button variant={'outline-dark'}>{t('Book.genres')}={this.state.selectedGenres.map(genre=>{return genre.name[i18n.language] ? genre.name[i18n.language] : genre.nameCode}).toString()}</Button> : ''}
                {this.state.selectedYearBefore ?
                    <Button variant={'outline-dark'}>{t('Book.releasedBefore')}={this.state.selectedYearBefore}</Button> : ''}
                {this.state.selectedYearAfter ?
                    <Button variant={'outline-dark'}>{t('Book.releasedAfter')}={this.state.selectedYearAfter}</Button> : ''}
                {this.state.selectedCopyCount ?
                    <Button variant={'outline-dark'}>{t('Book.copyCount')}={this.state.copyCount}</Button> : ''}
            </div>
        </Fragment>);
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert variant={'danger'} show={this.state.requestError}
                       className={' mt-0 mb-3 m-5'}>{t(this.state.message)}</Alert>
                {this.state.doFilter ? this.displayFilterInfo() : ''}
                <div className={'usersButtons'}>
                    <div className={'m-3 sortDiv'}>
                        <Form.Label>{t('Form.sortBy')}</Form.Label>
                        <Form.Select defaultValue={this.state.sortBy} onChange={(e) => {
                            this.setState({
                                sortBy: e.target.value
                            });
                        }}>
                            <option value={'titleUp'}>{t('Form.titleUp')}</option>
                            <option value={'titleDown'}>{t('Form.titleDown')}</option>
                            <option value={'authorSurnameUp'}>{t('Form.authorSurnameUp')}</option>
                            <option value={'authorSurnameDown'}>{t('Form.authorSurnameDown')}</option>
                            <option value={'authorNameUp'}>{t('Form.authorNameUp')}</option>
                            <option value={'authorSNameDown'}>{t('Form.authorNameDown')}</option>
                            <option value={'releaseYearUp'}>{t('Form.releaseYearUp')}</option>
                            <option value={'releaseYearDown'}>{t('Form.releaseYearDown')}</option>
                            <option value={'copyCountUp'}>{t('Form.copyCountUp')}</option>
                            <option value={'copyCountDown'}>{t('Form.copyCountDown')}</option>

                        </Form.Select>
                    </div>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'}
                            onClick={this.reloadTable.bind(this)}>
                        <img src={RefreshIcon} alt={''} width={20} height={20}/>
                    </Button>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'} onClick={this.showFilter.bind(this)}>
                        {t('Form.FilterButton')}
                    </Button>
                </div>
                <div className={'mt-3 mb-3 m-5 accounts'}>
                    <Table striped hover>
                        <thead>
                        <th>{t('Book.title')}</th>
                        <th>{t('Book.author')}</th>
                        <th>{t('Book.releaseDate')}</th>
                        <th>{t('Book.genres')}</th>
                        <th>{t('Book.copyCount')}</th>
                        </thead>
                        <tbody>
                        {this.state.books ? this.renderRows() : ''}
                        </tbody>
                    </Table>
                </div>
                <Offcanvas show={this.state.showFilter} onHide={this.hideFilter.bind(this)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{t('Filter.Title')}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={this.handleFilter.bind(this)}>
                            <TextField
                                className={'m-3'}
                                variant={'standard'}
                                value={this.state.title}
                                label={t('Book.title')}
                                onChange={(event) => {
                                    this.setState({
                                        title: event.target.value
                                    })
                                }}/>
                            <Autocomplete className={'m-3'}
                                          onChange={((event, newValue) => {
                                              this.setState({
                                                  selectedAuthor: newValue
                                              })
                                          })}
                                          options={this.state.authors}
                                          getOptionLabel={(option) => {
                                              return `${option.name} ${option.surname} `
                                          }}
                                          renderInput={(params) => (
                                              <TextField
                                                  {...params}
                                                  variant="standard"
                                                  label={t('Book.author')}
                                              />
                                          )}
                            />
                            <Autocomplete
                                className={'m-3'}
                                multiple
                                filterSelectedOptions
                                onChange={((event, newValue) => {
                                    this.setState({
                                        selectedGenres: newValue
                                    })
                                })}
                                options={this.state.genres}
                                getOptionLabel={(option) => {
                                    return option.name[i18n.language] ? option.name[i18n.language] : option.nameCode
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={t('Book.genres')}
                                    />
                                )}
                            />
                            <TextField
                                className={'m-3'}
                                type={'number'}
                                variant={'standard'}
                                value={this.state.selectedYearBefore}
                                label={t('Book.releasedBefore')}
                                onChange={(event) => {
                                    this.setState({
                                        selectedYearBefore: event.target.value
                                    })
                                }}/>
                            <TextField
                                className={'m-3'}
                                type={'number'}
                                variant={'standard'}
                                value={this.state.selectedYearAfter}
                                label={t('Book.releasedAfter')}
                                onChange={(event) => {
                                    this.setState({
                                        selectedYearAfter: event.target.value
                                    })
                                }}/>
                            <TextField
                                className={'m-3'}
                                type={'number'}
                                variant={'standard'}
                                value={this.state.selectedCopyCount}
                                label={t('Book.copyCount')}
                                onChange={(event) => {
                                    this.setState({
                                        selectedCopyCount: event.target.value
                                    })
                                }}/>
                            <br/>
                            <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                                {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                            </Button>
                            <Button variant='outline-dark' size="md" type="button" onClick={() => {
                                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                                this.setState({
                                    title:'',
                                    selectedGenres: [],
                                    selectedAuthor: '',
                                    selectedYearBefore: "",
                                    selectedYearAfter: "",
                                    selectedCopyCount: "",
                                    copyCount: "",
                                    doFilter: false
                                });
                                makeBookListRequest(token, this);
                                this.hideFilter();

                            }} className='m-3' disabled={false}>
                                {t('Form.ClearFilter')}
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
            </Fragment>
        );
    }

}

const BookListTr = withTranslation()(BookListNoTr);

export default function BookList() {
    return (<BookListTr/>)
}