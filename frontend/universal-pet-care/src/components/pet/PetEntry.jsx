import {
  Form,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { FaMinus } from "react-icons/fa";
import PetColorSelector from "./PetColorSelector";
import PetTypeSelector from "./PetTypeSelector";
import PetBreedSelector from "./PetBreedSelector";

const PetEntry = ({ pet, index, removePet, canRemove, handleInputChange }) => {
  return (
    <fieldset className="field-set mb-4">
      <legend className="legend">{`Evcil Hayvan #${
        index + 1
      } Detayları`}</legend>
      <fieldset className="mb-4">
        <Form.Group as={Row}>
          <Col md={6}>
            <Form.Control
              className="mb-2"
              type="text"
              name="name"
              id={`petName-${index}`}
              value={pet.name}
              placeholder="Evcil Hayvan Adını Giriniz"
              onChange={handleInputChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              className="mb-2"
              type="number"
              name="age"
              id={`petAge-${index}`}
              value={pet.age}
              placeholder="Evcil Hayvan Yaşını Giriniz"
              onChange={handleInputChange}
              required
            />
          </Col>
        </Form.Group>
      </fieldset>
      <Form.Group as={Col} className="mb-4">
        <PetColorSelector value={pet.color} onChange={handleInputChange} />
      </Form.Group>
      <fieldset className="field-set mb-4">
        <legend className="legend">Evcil Hayvan Türü ve Irkı</legend>
        <Form.Group as={Row} className="mb-2 d-flex">
          <Col>
            <PetTypeSelector value={pet.type} onChange={handleInputChange} />
          </Col>
          <Col>
            <PetBreedSelector
              petType={pet.type}
              value={pet.breed}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
      </fieldset>
      {canRemove && (
        <div className="d-flex justify-content-end mt-2">
          <OverlayTrigger overlay={<Tooltip>Evcil Hayvanı Kaldır</Tooltip>}>
            <Button variant="danger" size="sm" onClick={() => removePet(index)}>
              <FaMinus />
            </Button>
          </OverlayTrigger>
        </div>
      )}
    </fieldset>
  );
};

export default PetEntry;
