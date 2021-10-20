import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { GALLERIES_PREFIX_ROUTE } from '../../constants/ApiRoutes';
import { Container, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { BsInfoSquare } from 'react-icons/bs';
import { AdminAddEditInfoGallery } from './AdminAddEditInfoGallery.js'
import { ShowError, ShowResponse } from '../util/Notifier';
import ConfirmDelete from '../ConfirmDelete';
import { useSessionStorage } from '../util/Session';
import './QuoteGallery.css';
import { IoMdAdd } from 'react-icons/io';



export const AdminGallery = () => {
    const [token, setToken] = useSessionStorage("token", "");
    const [galleries, setGalleries] = useState([]);
    const [headers, setHeaders] = useState({ 'Authorization': '' });
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [changeHappened, setChangeHappened] = useState(false);
    const [deleteData, setDeleteData] = useState(
        {
            'galleryId': 0,
            'show': false
        }
    );
    const closeModal = () => setDeleteData({
        'galleryId': 0,
        'show': false
    });

    const history = useHistory();

    const redirectToLogin = useCallback(() => {
        history.push({ pathname: `/admin` });
    }, [history]);

    async function sendPostRequest(newGallery) {
        await axios.post(GALLERIES_PREFIX_ROUTE, newGallery, { headers: headers })
            .then((response) => ShowResponse(response))
            .catch((error) => ShowError(error, () => { redirectToLogin() }));
        setChangeHappened(!changeHappened);
    }

    async function sendPutRequest(updatedGallery) {
        await axios.put(GALLERIES_PREFIX_ROUTE, updatedGallery, { headers: headers })
            .then((response) => ShowResponse(response))
            .catch((error) => ShowError(error, () => { redirectToLogin() }));
        setChangeHappened(!changeHappened);
    }

    async function sendPutRequestPhotos(photos, galleryId) {
        await axios.put(`${GALLERIES_PREFIX_ROUTE}/${galleryId}/images`, photos,
            {
                headers:
                {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .catch((error) => ShowError(error, () => { redirectToLogin() }));
        setChangeHappened(!changeHappened);
    }

    async function sendDeleteRequest(galleryId) {
        await axios.delete(`${GALLERIES_PREFIX_ROUTE}/${galleryId}`, { headers: headers })
            .then((response) => ShowResponse(response))
            .catch((error) => ShowError(error, () => { redirectToLogin() }));
        setChangeHappened(!changeHappened);
    }

    useEffect(() => {
        const cancelTokenForGallery = axios.CancelToken;
        const sourceForGallery = cancelTokenForGallery.source();

        async function fetchData() {
            await axios.get(GALLERIES_PREFIX_ROUTE, { cancelToken: sourceForGallery.token })
                .then((async response => {
                    setGalleries(response.data);
                }))
                .catch((error) => redirectToLogin());
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
            setGalleries([]);
            setHeaders({ 'Authorization': '' });
            sourceForGallery.cancel();
        }
    }, [changeHappened, token, redirectToLogin]);

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const showAddModal = () => {
        setAddModal(true);
        setEditModal(false);
        setInfoModal(false);
        toggle();
    }

    const [selectedGallery, setSelectedGallery] = useState({});

    async function fetchWholeGallery(selectedGalleryId) {
        setSelectedGallery({});
        await axios.get(`${GALLERIES_PREFIX_ROUTE}/${selectedGalleryId}?Width=300&Height=300`)
            .then((async response => {
                setSelectedGallery(response.data);
            }));
    }

    async function showEditModal(gallery) {
        setEditModal(true);
        setAddModal(false);
        setInfoModal(false);
        await fetchWholeGallery(gallery.galleryId);
        toggle();
    }

    async function showInfoModal(gallery) {
        setInfoModal(true);
        setEditModal(false);
        setAddModal(false);
        await fetchWholeGallery(gallery.galleryId);
        toggle();
    }


    const EditGallery = () => {
        return (
            <AdminAddEditInfoGallery edit={true} gallery={selectedGallery}
                func={async (editedGallery) => sendPutRequest(editedGallery)}
                addPhotos={async (photos, id) => sendPutRequestPhotos(photos, id)}
                toggle={() => toggle()} />
        )
    }

    const AddGallery = () => {

        return (
            <AdminAddEditInfoGallery add={true}
                func={async (newGallery) => sendPostRequest(newGallery)}
                toggle={() => toggle()} />
        )
    }

    const InfoGallery = () => {
        return (
            <AdminAddEditInfoGallery info={true} gallery={selectedGallery}
                toggle={() => toggle()} />
        )
    }

    return (
        <div>
            {deleteData.show && <ConfirmDelete onClose={closeModal} onDelete={async () => await sendDeleteRequest(deleteData.galleryId)} />}
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
                    <Table dark className="admin-quote-table">
                        <thead>
                            <tr>
                                <th>Galerija</th>
                                <th>Opis</th>
                                <th>Br. fotografija</th>
                                <th colSpan={3}>Opcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {galleries.map((gallery, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{gallery.name}</td>
                                        <td>{gallery.description}</td>
                                        <td>{gallery.mediaFiles.length}</td>
                                        <td>
                                            <BsInfoSquare className='admin-index-options-button'
                                                onClick={async () => showInfoModal(gallery)} />
                                        </td>
                                        <td>
                                            <FiEdit className='admin-index-options-button'
                                                onClick={async () => showEditModal(gallery)} />
                                        </td>
                                        <td>
                                            <MdDeleteForever className='admin-index-options-button'
                                                onClick={() => setDeleteData({ 'galleryId': gallery.galleryId, 'show': true })} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>
                <Modal isOpen={modal} size={addModal ? "md" : "lg"} toggle={toggle} className="admin-quotes-gallery-modal" unmountOnClose={true}>
                    <ModalHeader toggle={toggle} >
                        {addModal && <div>Dodaj galeriju</div>}
                        {editModal && <div>Izmijeni galeriju</div>}
                        {infoModal && <div>Pregledaj galeriju</div>}
                    </ModalHeader>
                    <ModalBody>
                        {editModal && <EditGallery />}
                        {infoModal && <InfoGallery />}
                        {addModal && <AddGallery />}
                    </ModalBody>
                </Modal>
            </Container>
        </div>
    )
}
