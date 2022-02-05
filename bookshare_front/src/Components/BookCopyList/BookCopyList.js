import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert, Button, Modal, Offcanvas, Pagination, Table} from "react-bootstrap";
import Cookies from "js-cookie";
import './BookCopyList.css';
import RefreshIcon from '../../Resources/refresh.png';
import Form from "react-bootstrap/Form";
import {makeAuthorListRequest} from "../../Requests/moks/AuthorListRequest";
import {makeGenreListRequest} from "../../Requests/moks/GenreListRequest";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import i18n from "i18next";
import {makeBookListRequest} from "../../Requests/moks/BookListRequest";
import {LangCodes} from "../../Utils/LangCodes";
import {CoverTypes} from "../../Utils/CoverTypes";
import Icon from "../../Resources/pin.svg";
import Map from "../../Resources/map.png";
import MapPicker from "react-google-map-picker";
import {makeBookCopyListRequest, makeFilteredBookCopyListRequest} from "../../Requests/moks/BookCopyListRequest";

class BookCopyListNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBook:null,
            copies: [],
            books: [],
            authors: [],
            genres: [],
            title: '',
            selectedGenres: [],
            selectedAuthor: '',
            selectedYearBefore: "",
            selectedYearAfter: "",
            selectedCopyCount: "",
            selectedAvailability:true,
            copyCount: "",
            requestError: false,
            message: '',
            showFilter: false,
            doFilter: true,
            filterErrors: {},
            button: 'Form.Filter',
            sortBy: 'titleUp',
            location: '',
            locationAvailable: false,
            showModal: false,
            active:0,
            display:15

        };
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    locationAvailable: true
                })
            })
        } else {
            this.setState({
                locationAvailable: false
            });
        }

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

    showModal() {
        this.setState({
            showModal: true
        });
    }

    hideModal() {
        this.setState({
            showModal: false
        });
    }

    getLocationFromBrowser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    location: {lat: loc.coords.latitude, lng: loc.coords.longitude},
                    locationAvailable: true
                });
            })
        } else {
            this.setState({
                locationAvailable: false
            });
        }
    }

    getLocationFromMap(lat, lng) {
        this.setState({
            location: {lat: lat, lng: lng},
            showModal: false
        });
    }


    makeRequest() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAuthorListRequest(token, this);
        makeGenreListRequest(token, this);
        makeBookListRequest(token, this);
        this.state.doFilter ? makeFilteredBookCopyListRequest(token, this.state.selectedBook?this.state.selectedBook.id:null, this.state.title, this.state.selectedAuthor !== undefined ? this.state.selectedAuthor.id : null, this.state.selectedGenres.map(genre => {
            return genre.id
        }), this.state.selectedYearBefore, this.state.selectedYearAfter, this.state.selectedLanguage?this.state.selectedLanguage.code:null, this.state.selectedCoverType, this.state.selectedAvailability, this.state.location.lat, this.state.location.lng, this.state.filterDistance, this) : makeBookCopyListRequest(token, this)
    }

    reloadTable() {
        this.makeRequest();
    }

    renderRow(row) {
        const {t} = this.props;
        return (
            <tr className={'accountRow'} onClick={() => {
                window.location.hash = `#/books/copies/${row.id}`;
                window.location.reload();
            }}>
                <td>{row.title}</td>
                <td>{`${row.author.name} ${row.author.surname}`}</td>
                <td>{row.releaseDate}</td>
                <td>{row.genres.map(genre => {
                    return `${genre.name[i18n.language] ? genre.name[i18n.language] : genre.nameCode}`
                }).toString()}</td>
                <td>{LangCodes.map(lang => {
                    return lang.code === row.language ? lang.native : ''
                })}</td>
                <td>{t(row.cover)}</td>
                <td>{row.available ? t('Form.Yes') : t('Form.No')}</td>
                <td>{row.distance ? (row.distance > 1 ? `${row.distance.toFixed(1)} km` : `${row.distance.toFixed(3).substring(2, 5)} m`) : t('Bookshelf.noLocation')}</td>
            </tr>)
    }

    renderRows() {
        const rows = this.state.copies;
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
        if (this.state.sortBy === "distanceDown") {
            rows.sort((a, b) => {
                return a.distance === undefined ? (b.distance === undefined ? 0 : -1) : (b.distance === undefined ? 1 : (a.distance < b.distance ? 1 : (b.distance < a.distance ? -1 : 0)))

            });
        }
        if (this.state.sortBy === "distanceUp") {
            rows.sort((a, b) => {
                return a.distance === undefined ? (b.distance === undefined ? 0 : -1) : (b.distance === undefined ? 1 : (a.distance < b.distance ? -1 : (b.distance < a.distance ? 1 : 0)))

            });
        }


        return rows.map((row,index) => {
            return (index>= (this.state.active * this.state.display)&&index< (this.state.active + 1) * this.state.display)?this.renderRow(row):''
        });

    }

    handleFilter() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if (this.state.selectedBook || this.state.title || this.state.selectedGenres.length > 0 || this.state.selectedAuthor || this.state.selectedYearBefore || this.state.selectedYearAfter || this.state.selectedLanguage || this.state.selectedCoverType || this.state.selectedAvailability != null || this.state.location.lng || this.state.filterDistance) {
            this.setState({
                doFilter: true
            });
            makeFilteredBookCopyListRequest(token, this.state.selectedBook?this.state.selectedBook.id:null, this.state.title, this.state.selectedAuthor !== undefined ? this.state.selectedAuthor.id : null, this.state.selectedGenres.map(genre => {
                return genre.id
            }), this.state.selectedYearBefore, this.state.selectedYearAfter, this.state.selectedLanguage?this.state.selectedLanguage.code:null, this.state.selectedCoverType, this.state.selectedAvailability, this.state.location.lat, this.state.location.lng, this.state.filterDistance, this)
        }
        this.hideFilter();

    }

    displayFilterInfo() {
        const {t} = this.props;
        return (<Fragment>
            <div>{t('Filter.ActiveFilters')}:</div>
            <div className={'activeFilters mt-0 mb-0 m-5'}>
                {this.state.selectedBook ?
                    <Button variant={'outline-dark'}>{t('Book.book')}={this.state.selectedBook.title}</Button> : ''}
                {this.state.title ?
                    <Button variant={'outline-dark'}>{t('Book.title')}={this.state.title}</Button> : ''}
                {this.state.selectedAuthor ?
                    <Button
                        variant={'outline-dark'}>{t('Book.author')}={`${this.state.selectedAuthor.name} ${this.state.selectedAuthor.surname}`}</Button> : ''}
                {this.state.selectedGenres.length > 0 ?
                    <Button variant={'outline-dark'}>{t('Book.genres')}={this.state.selectedGenres.map(genre => {
                        return genre.name[i18n.language] ? genre.name[i18n.language] : genre.nameCode
                    }).toString()}</Button> : ''}
                {this.state.selectedYearBefore ?
                    <Button
                        variant={'outline-dark'}>{t('Book.releasedBefore')}={this.state.selectedYearBefore}</Button> : ''}
                {this.state.selectedYearAfter ?
                    <Button
                        variant={'outline-dark'}>{t('Book.releasedAfter')}={this.state.selectedYearAfter}</Button> : ''}
                {this.state.selectedLanguage ?
                    <Button variant={'outline-dark'}>{t('Book.language')}={this.state.selectedLanguage.native}</Button> : ''}
                {this.state.selectedCoverType ?
                    <Button variant={'outline-dark'}>{t('Book.coverType')}={t(this.state.selectedCoverType)}</Button> : ''}
                {this.state.selectedAvailability != null ?
                    <Button variant={'outline-dark'}>{t('Book.availability')}={t(this.state.selectedAvailability?t('Form.Yes'):t('Form.No'))}</Button> : ''}
                {this.state.filterDistance ?
                    <Button variant={'outline-dark'}>{t('Form.distance')}={this.state.filterDistance}</Button> : ''}
                {this.state.location ?
                    <Button
                        variant={'outline-dark'}>{t('Form.userLocation')}={`${this.state.location.lng ? this.state.location.lng.toString().substring(0, 5) : ''} ${this.state.location.lat ? this.state.location.lat.toString().substring(0, 5) : ''}`}</Button> : ''}
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
                    <div className={'m-3 sortDiv'}>                <Pagination className={'ms-5'}>
                        <Pagination.Prev disabled={this.state.active===0} onClick={()=>this.setState({
                            active: this.state.active-1
                        })}/>
                        <Pagination.Next disabled={((this.state.active + 1)  * this.state.display) >= this.state.copies.length} onClick={()=>this.setState({
                            active: this.state.active+1
                        })}/>
                        <div className={'ms-3 mt-1'}>{t(`Form.PaginationInfo`,{from:`${this.state.active * this.state.display + 1}`,to:`${Math.min(this.state.copies.length,(this.state.active + 1) * this.state.display)}`,of: `${this.state.copies.length}`})}</div>
                    </Pagination> </div>
                    <div className={'m-3 sortDiv'}>
                        <Form.Label>{t('Form.displaySize')}</Form.Label>
                        <Form.Select defaultValue={this.state.sortBy} onChange={(e) => {
                            this.setState({
                                display: e.target.value,
                                active:0
                            });
                        }}>
                            <option value={15}>{t('15')}</option>
                            <option value={30}>{t('30')}</option>
                            <option value={50}>{t('50')}</option>
                            <option value={100}>{t('100')}</option>
                        </Form.Select>
                    </div>
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
                            <option value={'distanceUp'}>{t('Form.distanceUp')}</option>
                            <option value={'distanceDown'}>{t('Form.distanceDown')}</option>

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
                        <th>{t('Book.language')}</th>
                        <th>{t('Book.coverType')}</th>
                        <th>{t('Book.availability')}</th>
                        <th>{t('Form.distance')}</th>
                        </thead>
                        <tbody>
                        {this.state.copies ? this.renderRows() : ''}
                        </tbody>
                    </Table>
                </div>
                <Offcanvas show={this.state.showFilter} onHide={this.hideFilter.bind(this)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{t('Filter.Title')}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={this.handleFilter.bind(this)}>


                            <Autocomplete className={'m-3'}
                                          onChange={((event, newValue) => {
                                              this.setState({
                                                  selectedBook: newValue
                                              })
                                          })}
                                          options={this.state.books}
                                          getOptionLabel={(option) => {
                                              return option.title
                                          }}
                                          renderInput={(params) => (
                                              <TextField
                                                  {...params}
                                                  variant="standard"
                                                  label={t('Book.book')}
                                              />
                                          )}
                            />
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
                            <Autocomplete
                                className={'m-3'}
                                filterSelectedOptions
                                onChange={((event, newValue) => {
                                    this.setState({
                                        selectedLanguage: newValue
                                    })
                                })}
                                options={LangCodes}
                                getOptionLabel={(option) => {
                                    return option.native
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={t('Book.language')}
                                    />
                                )}
                            />
                            <Autocomplete
                                className={'m-3'}
                                filterSelectedOptions
                                onChange={((event, newValue) => {
                                    this.setState({
                                        selectedCoverType: newValue
                                    })
                                })}
                                options={CoverTypes}
                                getOptionLabel={(option) => {
                                    return t(option)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={t('Book.coverType')}
                                    />
                                )}
                            />
                            <Autocomplete
                                className={'m-3'}
                                filterSelectedOptions
                                defaultValue={this.state.selectedAvailability}
                                onChange={((event, newValue) => {
                                    this.setState({
                                        selectedAvailability: newValue
                                    })
                                })}
                                options={[true, false]}
                                getOptionLabel={(option) => {
                                    return option ? t('Form.Yes') : t('Form.No')
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={t('Book.availability')}
                                    />
                                )}
                            />
                            <Form.Group size="lg" controlId="userLocation">
                                <div>
                                    <TextField
                                        aria-readonly={true}
                                        disabled={true}
                                        className={'m-3'}
                                        type={'text'}
                                        variant={'standard'}
                                        value={`${this.state.location.lng ? this.state.location.lng.toString().substring(0, 5) : ''} ${this.state.location.lat ? this.state.location.lat.toString().substring(0, 5) : ''}`}
                                        label={t('Form.userLocation')}/>
                                    <br/>
                                    <Button className={'mt-3 mb-0 m-1'}
                                            size={"sm"}
                                            disabled={!this.state.locationAvailable}
                                            onClick={this.getLocationFromBrowser.bind(this)}
                                            variant={'outline-dark'}>{
                                        <img alt={''} className={'mt-0 mb-0 m-1'} src={Icon} height={25}
                                             width={25}/>}{t('Form.LocationButton')}
                                    </Button>
                                    <Button className={'mt-3 mb-0 m-1'}
                                            size={"sm"}
                                            onClick={this.showModal.bind(this)}
                                            variant={'outline-dark'}>{
                                        <img alt={''} className={'mt-0 mb-0 m-1'} src={Map} height={25}
                                             width={25}/>}{t('Form.FromMapButton')}
                                    </Button>
                                </div>
                            </Form.Group>
                            <Form.Group size="lg" controlId="distance">
                                <Form.Label className="required">{t('Form.distance')}</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="number"
                                    value={this.state.filterDistance}
                                    onChange={(e) => {
                                        this.setState({
                                            filterDistance: e.target.value
                                        });
                                    }}
                                />
                                <Form.Range
                                    autoFocus
                                    min={0}
                                    max={20}
                                    value={this.state.filterDistance}
                                    onChange={(e) => {
                                        this.setState({
                                            filterDistance: e.target.value
                                        });
                                    }}/>

                            </Form.Group>
                            <br/>
                            <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                                {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                            </Button>
                            <Button variant='outline-dark' size="md" type="button" onClick={() => {
                                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                                this.setState({
                                    selectedBook:null,
                                    title: '',
                                    selectedGenres: [],
                                    selectedAuthor: '',
                                    selectedYearBefore: "",
                                    selectedYearAfter: "",
                                    selectedCopyCount: "",
                                    selectedLanguage: "",
                                    selectedCoverType:'',
                                    selectedAvailability:null,
                                    filterDistance: '',
                                    location: '',
                                    doFilter: false
                                });
                                makeBookCopyListRequest(token, this);
                                this.hideFilter();

                            }} className='m-3' disabled={false}>
                                {t('Form.ClearFilter')}
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
                <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.PickLocation')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MapPicker apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                   defaultLocation={{lat: 51.71, lng: 19.44}}
                                   zoom={10}
                                   onChangeLocation={this.getLocationFromMap.bind(this)}
                        />
                    </Modal.Body>
                </Modal>
            </Fragment>
        );
    }

}

const BookCopyListTr = withTranslation()(BookCopyListNoTr);

export default function BookCopyList() {
    return (<BookCopyListTr/>)
}