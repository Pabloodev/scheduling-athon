// Imports gerais
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { useState, useCallback } from "react";

// Imports de estilos
import styles from "./InputFile.module.css";

const InputFile = () => {
  const [data, setData] = useState([]); // Estado para armazenar os dados do Excel
  const [filteredData, setFilteredData] = useState([]); // Estado para armazenar os dados filtrados
  const [region, setRegion] = useState(null); // Estado para armazenar a região selecionada

  const [copyMessage, setCopyMessage] = useState("");

  // Função para filtrar os dados baseado na região
  const filterDataByRegion = useCallback((data, region) => {
    return data.filter(
      (row) =>
        (row.Diagnóstico === "CLIENTE AUSENTE" && row["Setor"] === region) ||
        (row.Diagnóstico === "ENDEREÇO NÃO LOCALIZADO " &&
          row["Setor"] === region)
    );
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]; // Pega o primeiro arquivo da lista

      if (file) {
        // Verificação simples do tipo de arquivo
        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
          alert("Por favor, selecione um arquivo Excel.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryStr = e.target.result;

          try {
            // Leitura do arquivo Excel e conversão para JSON
            const workBook = XLSX.read(binaryStr, { type: "binary" });
            const worksheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Atualização do estado com os dados do Excel
            setData(jsonData);

            // Filtragem dos dados baseado na região (caso tenha sido selecionada)
            if (region) {
              const filteredOS = filterDataByRegion(jsonData, region);
              setFilteredData(filteredOS);
            } else {
              const filteredOS = filterDataByRegion(jsonData, "SBC"); // Filtro padrão para "SBC"
              setFilteredData(filteredOS);
            }
          } catch (error) {
            console.error("Erro ao ler o arquivo Excel:", error);
            alert("Erro ao processar o arquivo Excel.");
          }
        };
        reader.readAsBinaryString(file); // Lê o arquivo como uma string binária
      }
    },
    [filterDataByRegion, region]
  );

  const handleCopy = () => {
    setCopyMessage("Copiado!");
    const text = filteredData
      .map((row) => row["Cliente"] + " -" + row["Assunto"].substring(2) + "\n")
      .join("");
    navigator.clipboard.writeText(text);
  };

  // Função para atualizar a região
  const handleClick = useCallback(
    (e) => {
      setCopyMessage("");
      const selectedRegion = e.target.innerText;
      setRegion(selectedRegion);

      // Após selecionar a região, filtra os dados
      const filteredOS = filterDataByRegion(data, selectedRegion);
      setFilteredData(filteredOS);
    },
    [data, filterDataByRegion]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        <p>Arraste e solte o arquivo aqui ou clique para selecionar</p>
      </div>

      <div className={styles.buttons}>
        <button onClick={handleClick}>SBC</button>
        <button onClick={handleClick}>GRAJAÚ</button>
        <button onClick={handleClick}>FRANCO</button>
      </div>

      {/* Visualização dos dados filtrados */}
      <div className={styles.data}>
        <div></div>
        {filteredData.length > 0 ? (
          <div>
            <ul>
              {filteredData.map((row, index) => (
                <li key={index}>
                  <p
                    style={{
                      color:
                        row["Diagnóstico"] === "ENDEREÇO NÃO LOCALIZADO "
                          ? "orange"
                          : "white",
                    }}
                  >
                    <strong>{row["Cliente"]}</strong> -{" "}
                    {row["Assunto"].substring(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div>
              <button className={styles.copy} onClick={handleCopy}>
                Copiar
              </button>
              <span className={styles.copyMessage}>{copyMessage}</span>
            </div>
          </div>
        ) : (
          <p>
            Nenhum dado para exibir, importe o arquivo de ordens de serviço.
          </p>
        )}
      </div>
    </div>
  );
};

export default InputFile;
