import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Container, Table,
    Modal, ModalHeader, ModalBody
} from 'reactstrap';
import { QUOTES_PREFIX_ROUTE } from '../../constants/ApiRoutes';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { ShowResponse, ShowError } from '../util/Notifier';
import { ToastContainer } from 'react-toastify';
import { AdminAddEditQuote } from './AdminAddEditQuote';
import ConfirmDelete from '../ConfirmDelete';
import { useSessionStorage } from '../util/Session';
import './QuoteGallery.css';
import { IoMdAdd } from 'react-icons/io';

export const AdminQuotes = () => {
    const [token, setToken] = useSessionStorage("token", "");
    const [quotes, setQuotes] = useState([]);
    const [headers, setHeaders] = useState({ 'Authorization': '' });
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [changeHappened, setChangeHappened] = useState(false);
    const [deleteData, setDeleteData] = useState(
        {
            'quoteId': 0,
            'show': false
        }
    );
    const closeModal = () => setDeleteData({
        'quoteId': 0,
        'show': false
    });

    const history = useHistory();

    const redirectToLogin = useCallback(() => {
        history.push({ pathname: `/admin` });
    }, [history]);

    async function sendPostRequest(newQuote) {
        await axios.post(QUOTES_PREFIX_ROUTE, newQuote, { headers: headers })
            .then((response) => ShowResponse(response))
            .catch((error) => ShowError(error, () => { redirectToLogin() }));
        setChangeHappened(!changeHappened);
    }

    async function sendPutRequest(updatedQuote) {
        await axios.put(QUOTES_PREFIX_ROUTE, updatedQuote, { headers: headers })
            .then((response) => ShowResponse(response))
            .catch((error) => ShowError(error, () => { redirectToLogin() }));
        setChangeHappened(!changeHappened);
    }

    async function sendDeleteRequest(quoteId) {
        await axios.delete(`${QUOTES_PREFIX_ROUTE}/${quoteId}`, { headers: headers })
            .then((response) => ShowResponse(response))
            .catch((error) => ShowError(error, () => { redirectToLogin() }));
        setChangeHappened(!changeHappened);
    }

    useEffect(() => {
        const cancelTokenForQuotes = axios.CancelToken;
        const sourceForQuotes = cancelTokenForQuotes.source();

        async function fetchData() {
            await axios.get(QUOTES_PREFIX_ROUTE, { cancelToken: sourceForQuotes.token })
                .then((async response => {
                    setQuotes(response.data);
                }))
                .catch(() => redirectToLogin());
        }

        if (token !== "") {
            const headers = {
                'Authorization': token
            }
            setHeaders(headers);
            fetchData();
        } else
            redirectToLogin();

        return () => {
            setQuotes([]);
            setHeaders({ 'Authorization': '' });
            sourceForQuotes.cancel();
        }
    }, [changeHappened, token, redirectToLogin]);

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const showAddModal = () => {
        setAddModal(true);
        setEditModal(false);
        toggle();
    }

    const [quoteForEdit, setQuoteForEdit] = useState({});
    const showEditModal = (quote) => {
        setEditModal(true);
        setAddModal(false);
        setQuoteForEdit(quote);
        toggle();
    }

    const EditQuote = () => {

        return (
            <AdminAddEditQuote quote={quoteForEdit}
                func={async (editedQuote) => sendPutRequest(editedQuote)}
                toggle={() => toggle()} />
        )
    }

    const AddQuote = () => {

        return (
            <AdminAddEditQuote
                func={async (newQuote) => sendPostRequest(newQuote)}
                toggle={() => toggle()} />
        )
    }

    return (
        <div>
            {deleteData.show && <ConfirmDelete onClose={closeModal} onDelete={async () => await sendDeleteRequest(deleteData.quoteId)} />}
            <Container fluid className='admin-layout'>
                <button className='admin-layout-button' onClick={() => showAddModal()}><IoMdAdd /></button>
                <ToastContainer
                    position="bottom-right"
                    autoClose={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                />
                <Container fluid className='admin-index-container'>
                <Table bordered className='admin-index-table'>
                        <thead>
                            <tr>
                                <th>Citat</th>
                                <th>Autor</th>
                                <th colSpan={2}>Opcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((quote, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{quote.quoteText}</td>
                                        <td>{quote.author}</td>
                                        <td>
                                            <FiEdit className='admin-index-options-button'
                                                onClick={() => showEditModal(quote)} />
                                        </td>
                                        <td>
                                            <MdDeleteForever className='admin-index-options-button'
                                                onClick={() => setDeleteData({ 'quoteId': quote.quoteId, 'show': true })} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>
                <Modal isOpen={modal} size="md" toggle={toggle} className="admin-quotes-gallery-modal" unmountOnClose={true}>
                    <ModalHeader toggle={toggle} >
                        {addModal && <div>Dodaj citat</div>}
                        {editModal && <div>Izmijeni citat</div>}
                    </ModalHeader>
                    <ModalBody>
                        {addModal && <AddQuote />}
                        {editModal && <EditQuote />}
                    </ModalBody>
                </Modal>
            </Container>
        </div>
    )
}

