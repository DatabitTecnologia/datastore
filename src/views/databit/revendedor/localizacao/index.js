import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { getDistance } from 'geolib';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaEnvelope, FaGlobe, FaUser } from 'react-icons/fa';
import { Decode64 } from 'datareact/src/utils/crypto';
import Pointer1 from '../../../../assets/images/databit/pointer_blue.png';
import Pointer2 from '../../../../assets/images/databit/pointer_green.png';
import Pointer3 from '../../../../assets/images/databit/pointer_pink.png';
import Pointer4 from '../../../../assets/images/databit/pointer_silver.png';
import Pointer5 from '../../../../assets/images/databit/poniter_orange.png';
import Pointer6 from '../../../../assets/images/databit/pointer_black.png';
import Dropdown from '../../../../components/Dropdown';
import PlacesAutocomplete from '../../../../components/PlacesAutocomplete';
import { apiList } from 'datareact/src/api/crudapi';
import { LoadingOverlay } from '../../../../utils/databit/screenprocess';
import { getZipCode } from 'datareact/src/api/location';
import { capitalizeText } from 'datareact/src/utils/capitalize';

// Dados fictícios dos representantes
const mockRepresentantes = [
  {
    id: 1,
    nome: 'Revenda São Paulo',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    telefone: '(11) 99999-1111',
    whatsapp: '(11) 98888-1111',
    email: 'sp@revenda.com',
    site: 'https://revendasampa.com',
    contato: 'João Silva',
    latitude: -23.561684,
    longitude: -46.656139
  },
  {
    id: 2,
    nome: 'Revenda Campinas',
    endereco: 'Rua Barão Geraldo, 200 - Campinas, SP',
    telefone: '(19) 98888-2222',
    whatsapp: '(19) 97777-2222',
    email: 'campinas@revenda.com',
    site: 'https://revendacampinas.com',
    contato: 'Maria Oliveira',
    latitude: -22.909938,
    longitude: -47.062633
  },
  {
    id: 3,
    nome: 'Revenda Rio de Janeiro',
    endereco: 'Av. Atlântica, 500 - Rio de Janeiro, RJ',
    telefone: '(21) 97777-3333',
    whatsapp: '(21) 96666-3333',
    email: 'rj@revenda.com',
    site: 'https://revendarj.com',
    contato: 'Carlos Souza',
    latitude: -22.971964,
    longitude: -43.182553
  },
  {
    id: 4,
    nome: 'Revenda São Paulo 2',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    telefone: '(11) 99999-1111',
    whatsapp: '(11) 98888-2222',
    email: 'sp2@revenda.com',
    site: 'https://revendasampa2.com',
    contato: 'Ana Pereira',
    latitude: -23.79999,
    longitude: -46.79999
  }
];

const pointers = [Pointer1, Pointer2, Pointer3, Pointer4, Pointer5, Pointer6];

const AnyReactComponent = ({ text, index, showText = true, showDistance = false, distance = 0 }) => {
  const pointerImg = pointers[index % pointers.length]; // alterna de 0 a 5

  return (
    <div style={{ textAlign: 'center', transform: 'translate(-50%, -100%)' }}>
      <img src={pointerImg} alt={`pointer${(index % pointers.length) + 1}`} style={{ display: 'block', margin: '0 auto' }} />
      {showText && (
        <div
          style={{
            marginTop: '6px',
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '12px',
            padding: '2px 6px',
            borderRadius: '4px',
            display: 'inline-block',
            maxWidth: '100px',
            wordWrap: 'break-word',
            textAlign: 'center'
          }}
        >
          {text.substring(0, 30)}
        </div>
      )}
      {showDistance && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
            display: 'inline-block',
            maxWidth: '100px',
            wordWrap: 'break-word',
            textAlign: 'center'
          }}
        >
          {(distance / 1000).toFixed(1)} km
        </div>
      )}
    </div>
  );
};

const RevendedorLocalizacao = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationfixed, setUserLocationfixed] = useState(null);
  const [radius, setRadius] = useState(50); // km
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [input, setInput] = useState('');
  const [showAll, setShowAll] = useState(false);
  const maxToShow = 5;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiList('RevendedorVW', '*', '', '0=0').then((response) => {
      if (response.status === 200) {
        const tmprows = response.data;
        tmprows.forEach((element) => {
          getZipCode(element.cep).then((response) => {
            if (response.status === 200) {
              try {
                const tmplocation = response.data.results[0].geometry.location;
                element.latitude = tmplocation.lat;
                element.longitude = tmplocation.lng;
              } catch (error) {
                element.latitude = 0;
                element.longitude = 0;
              }
            }
          });
        });
        setRows([...tmprows]);
        setLoading(false);
      }
    });
  }, []);

  // Localização do usuário
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        // Faz o reverse geocoding para obter o nome da cidade
        try {
          const apiKey = Decode64(localStorage.getItem('apikey_maps'));
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.status === 'OK') {
            const addressComponents = data.results[0].address_components;
            const cityComponent = addressComponents.find(
              (c) => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
            );
            const cityName = cityComponent ? cityComponent.long_name : 'Cidade não encontrada';
            setInput(cityName);
          } else {
            console.warn('Geocoding falhou:', data.status);
          }
        } catch (err) {
          console.error('Erro ao fazer reverse geocoding:', err);
        }

        setUserLocation(coords);
        setUserLocationfixed(coords);
      },
      (error) => {
        console.warn('Erro ao obter localização:', error);

        const fallback = {
          latitude: -23.55052,
          longitude: -46.633308
        };

        setUserLocation(fallback);
        setUserLocationfixed(fallback);
      }
    );
  }, [rows]);

  // Filtragem por raio
  useEffect(() => {
    if (userLocation) {
      const dealersWithDistance = rows.map((dealer) => {
        const distanceMeters = getDistance(userLocation, {
          latitude: dealer.latitude,
          longitude: dealer.longitude
        });

        return {
          ...dealer,
          distanciaKm: Number((distanceMeters / 1000).toFixed(1)) // já como número
        };
      });

      // Ordena do mais próximo para o mais distante
      const sorted = dealersWithDistance.sort((a, b) => a.distanciaKm - b.distanciaKm);

      // Filtra apenas os dentro do raio
      const filtered = sorted.filter((dealer) => dealer.distanciaKm <= radius);

      setFilteredDealers(filtered);
      setShowAll(false); // Reseta para mostrar só 5 quando novo filtro
    }
  }, [userLocation, radius, rows]);

  // Buscar localização por endereço
  const handleSearch = async () => {
    if (!input) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&key=${Decode64(
          localStorage.getItem('apikey_maps')
        )}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setUserLocation({ latitude: lat, longitude: lng });
      } else {
        alert('Endereço não encontrado.');
      }
    } catch (error) {
      console.error('Erro na busca do endereço:', error);
    }
  };

  return (
    <div className="my-1" style={{ maxWidth: '1300px' }}>
      <Card style={{ borderRadius: '12px' }}>
        <Card.Header>
          <Card.Title as="h5">Nossas Revendas</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={4}>
              <Form.Label>Digite a Cidade desejada:</Form.Label>
              <PlacesAutocomplete
                value={input}
                onChange={setInput}
                onSelect={({ lat, lng, address }) => {
                  // Atualiza a localização com lat/lng e o texto no input
                  setUserLocation({ latitude: lat, longitude: lng });
                  setInput(address);
                }}
              />

              <Row className="align-items-end">
                <Col xs={6}>
                  <Dropdown
                    style={{ width: '180px', marginTop: '5px' }}
                    label="Raio de busca:"
                    options={[
                      { value: 10, label: '10 Km' },
                      { value: 25, label: '25 km' },
                      { value: 50, label: '50 Km' },
                      { value: 100, label: '100 km' }
                    ]}
                    onChange={(e) => setRadius(Number(e))}
                  />
                </Col>
                <Col xs={6}>
                  <Button className="color-button-primary mb-2 w-100" onClick={handleSearch}>
                    <i className={'feather icon-search'} />
                    Buscar
                  </Button>
                </Col>
              </Row>

              <ul className="mt-4" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {(showAll ? filteredDealers : filteredDealers.slice(0, maxToShow)).map((dealer, index) => {
                  let distance = 0;
                  if (userLocationfixed !== null) {
                    distance = getDistance(userLocationfixed, {
                      latitude: dealer.latitude,
                      longitude: dealer.longitude
                    });
                  }
                  return (
                    <Row key={dealer.id}>
                      <Col lg={1} style={{ marginTop: '80px', textAlign: 'center' }}>
                        <AnyReactComponent
                          index={index + 1}
                          lat={dealer.latitude}
                          lng={dealer.longitude}
                          text={capitalizeText(dealer.nome)}
                          showText={false}
                          showDistance={true}
                          distance={distance}
                        />
                      </Col>
                      <Col lg={11}>
                        <li className="label-destaque-14" style={{ marginBottom: '15px', marginLeft: '10px' }}>
                          <strong className="label-destaque-16">{capitalizeText(dealer.nome ?? '')}</strong>
                          <br />

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaMapMarkerAlt />
                            <span>{dealer.endereco}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaPhoneAlt />
                            <span>{capitalizeText(dealer.fone ?? '')}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaWhatsapp />
                            <span>{dealer.whatsapp}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaEnvelope />
                            <span>{dealer.email}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaGlobe />
                            <a
                              href={(dealer.site ?? '').startsWith('http') ? dealer.site ?? '' : `https://${dealer.site}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {dealer.site}
                            </a>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaUser />
                            <span>{capitalizeText(dealer.contato)}</span>
                          </div>

                          <hr />
                        </li>
                      </Col>
                    </Row>
                  );
                })}
              </ul>

              {filteredDealers.length > maxToShow && (
                <Button className="color-button-primary w-100" onClick={() => setShowAll(!showAll)} style={{ marginTop: '15px' }}>
                  {showAll ? 'Ocultar' : 'Mostrar mais'}
                </Button>
              )}
            </Col>

            <Col lg={8} style={{ height: '1200px' }}>
              {userLocation && (
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: Decode64(localStorage.getItem('apikey_maps'))
                  }}
                  defaultZoom={14}
                  center={{
                    lat: userLocation.latitude,
                    lng: userLocation.longitude
                  }}
                >
                  {filteredDealers.map((dealer, index) => (
                    <AnyReactComponent
                      key={dealer.id}
                      index={index + 1}
                      lat={dealer.latitude}
                      lng={dealer.longitude}
                      text={capitalizeText(dealer.nome)}
                    />
                  ))}
                </GoogleMapReact>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default RevendedorLocalizacao;
