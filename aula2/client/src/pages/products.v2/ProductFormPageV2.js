import React, { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Select,
  Button
} from "@chakra-ui/react";

export const ProductFormPageV2 = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [apiError, setApiError] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [entity, setEntity] = useState({
    id: null,
    name: "",
    price: 0,
    description: "",
    category: undefined,
  });

  useEffect(() => {
    CategoryService.findAll()
      .then((response) => {
        setCategories(response.data);
        if (id) {
          ProductService.findOne(id)
            .then((response) => {
              if (response.data) {
                console.log(response.data);
                setEntity({
                  id: response.data.id,
                  name: response.data.name,
                  price: response.data.price,
                  description: response.data.description,
                  category: response.data.category.id,
                });
                setApiError();
              } else {
                setApiError("Falha ao carregar o produto.");
              }
            })
            .catch((error) => {
              setApiError("Falha ao carregar o produto.");
            });
        } else {
          setEntity((previousEntity) => {
            return {
              ...previousEntity,
              category: response.data[0]?.id,
            };
          });
        }
        setApiError();
      })
      .catch((error) => {
        setApiError("Falha ao carregar a lista de categorias.");
      });
  }, [id]);

  useEffect(() => {
    reset(entity);
  }, [entity, reset]);

  const onSubmit = (data) => {
    const product = {
      ...data,
      id: entity.id,
      category: { id: data.category },
    };
    ProductService.save(product)
      .then((response) => {
        navigate("/product-v2");
      })
      .catch((error) => {        
        setApiError("Falha ao salvar o produto.");
      });
  };

  return (
    <div className="container">
      <h1 className="fs-2 text-center">Cadastro de Produto - V2s</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Nome</FormLabel>
          <Input
            id="name"
            placeholder="Nome do produto"
            {...register("name", {
              required: "O campo nome é obrigatório",
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.price}>
          <FormLabel htmlFor="price">Preço</FormLabel>
          <Input
            id="price"
            placeholder="0.0"
            {...register("price", {
              required: "O campo preço é obrigatório",
              min: { value: 0.01, message: "O valor deve ser maior que zero" },
            })}
            type="number"
            step="any"
          />

          <FormErrorMessage>
            {errors.price && errors.price.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Descrição</FormLabel>
          <Textarea
            id="description"
            placeholder="Descrição do produto"
            {...register("description", {
              required: "O campo descrição é obrigatório",
              minLength: {                
                value: 2,
                message: "O tamanho deve ser entre 2 e 1024 caracteres"
              },
              maxLength: {                
                value: 1024,
                message: "O tamanho deve ser entre 2 e 1024 caracteres"
              }
            })}
            size="sm"
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.category}>
          <FormLabel htmlFor="category">Categoria</FormLabel>

          <Select
            id="category"
            {...register("category", {
              required: "O campo categoria é obrigatório",
            })}
            size="sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>
        <div className="text-center">
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Salvar
          </Button>
        </div>
      </form>
      {apiError && <div className="alert alert-danger">{apiError}</div>}
      <div className="text-center">
        <Link to="/product-v2">Voltar</Link>
      </div>
    </div>
  );
};
export default ProductFormPageV2;
