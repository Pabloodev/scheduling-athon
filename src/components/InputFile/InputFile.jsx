import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { useState, useCallback } from "react";

import styles from "./InputFile.module.css";

const InputFile = () => {
  const [data, setData] = useState([]); // Estado para armazenar os dados do Excel
  const [filteredData, setFilteredData] = useState([]);
  const [region, setRegion] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');

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
      const file = acceptedFiles[0];

      if (file) {
        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
          alert("Por favor, selecione um arquivo Excel.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryStr = e.target.result;

          try {
            const workBook = XLSX.read(binaryStr, { type: "binary" });
            const worksheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            setData(jsonData);

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
    const text = filteredData
      .map((row) => "- " + row["Cliente"] + " -" + row["Assunto"].substring(2) + "\n")
      .join("");
    navigator.clipboard.writeText(text);
    setCopyMessage('copiado')

    setTimeout(() => {
      setCopyMessage('')
  }, 1000);
  };

  const handleClick = useCallback(
    (e) => {
      setCopyMessage("");
      const selectedRegion = e.target.innerText;
      setRegion(selectedRegion);

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
