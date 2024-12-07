import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const BudgetSystem = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [orcamento, setOrcamento] = useState([]);
  const [showOrcamento, setShowOrcamento] = useState(false);
  const [dadosEmpresa, setDadosEmpresa] = useState({
    nomeCliente: '',
    cnpjCliente: '',
    contatoCliente: '',
    observacoes: ''
  });

  // Importar planilha
  const handleImportarPlanilha = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

      // Mapear colunas específicas
      const produtosProcessados = jsonData.slice(1).map(row => ({
        material: row['E'], // Coluna E - Material
        descricaoMaterial: row['F'], // Coluna F - Descrição
        codigoEAN: row['M'], // Coluna M - EAN
        precoVenda: parseFloat(row['O']) || 0, // Coluna O - Preço Venda
        precoMinimo: parseFloat(row['P']) || 0, // Coluna P - Preço Mínimo
        estoque: parseInt(row['R']) || 0, // Coluna R - Estoque
        precoTablet: parseFloat(row['U']) || 0 // Coluna U - Preço Tablet
      }));

      setProdutos(produtosProcessados);
    };

    reader.readAsBinaryString(file);
  };

  // Buscar produtos
  const buscarProdutos = () => {
    if (!termoBusca.trim()) return;

    const resultados = produtos.filter(produto =>
      produto.material?.toString().toLowerCase().includes(termoBusca.toLowerCase()) ||
      produto.descricaoMaterial?.toString().toLowerCase().includes(termoBusca.toLowerCase()) ||
      produto.codigoEAN?.toString().includes(termoBusca)
    );

    setProdutosFiltrados(resultados);
  };

  // Componente de Orçamento
  const OrcamentoPreview = () => {
    const numeroOrcamento = new Date().getTime().toString().slice(-6);
    const dataEmissao = new Date().toLocaleDateString();
    const total = orcamento.reduce((sum, item) => sum + item.precoVenda, 0);

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="w-[210mm] min-h-[297mm] mx-auto p-8 bg-white shadow-lg">
          {/* Cabeçalho */}
          <div className="border-b-2 pb-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h1 className="text-2xl font-bold">EMPRESA</h1>
                <p className="text-sm">CNPJ: XX.XXX.XXX/0001-XX</p>
                <p className="text-sm">Tel: (XX) XXXX-XXXX</p>
                <p className="text-sm">Email: comercial@empresa.com.br</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">ORÇAMENTO #{numeroOrcamento}</h2>
                <p className="text-sm">Data: {dataEmissao}</p>
                <p className="text-sm">Validade: 7 dias</p>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="border p-4">
              <h3 className="font-bold mb-2">Cliente</h3>
              <p>Nome: {dadosEmpresa.nomeCliente}</p>
              <p>CNPJ: {dadosEmpresa.cnpjCliente}</p>
              <p>Contato: {dadosEmpresa.contatoCliente}</p>
            </div>
            <div className="border p-4">
              <h3 className="font-bold mb-2">Condições</h3>
              <p>Prazo: 28 DDL</p>
              <p>Pagamento: Boleto Bancário</p>
              <p>Frete: CIF</p>
            </div>
          </div>

          {/* Tabela de Produtos */}
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Material</th>
                <th className="border p-2 text-left">Descrição</th>
                <th className="border p-2 text-left">EAN</th>
                <th className="border p-2 text-right">Estoque</th>
                <th className="border p-2 text-right">Preço</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border p-2">{item.material}</td>
                  <td className="border p-2">{item.descricaoMaterial}</td>
                  <td className="border p-2">{item.codigoEAN}</td>
                  <td className="border p-2 text-right">{item.estoque}</td>
                  <td className="border p-2 text-right">R$ {item.precoVenda.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="4" className="border p-2 text-right">Total:</td>
                <td className="border p-2 text-right">R$ {total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Observações */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Observações:</h3>
            <p className="text-sm">{dadosEmpresa.observacoes || 'Nenhuma observação adicional.'}</p>
          </div>

          {/* Assinaturas */}
          <div className="grid grid-cols-2 gap-8 mt-16">
            <div className="text-center">
              <div className="border-t pt-2">
                <p className="font-bold">Vendedor</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t pt-2">
                <p className="font-bold">Cliente</p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="fixed bottom-4 right-4 space-x-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Imprimir
            </button>
            <button
              onClick={() => setShowOrcamento(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Importação de Planilha */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Importar Catálogo</h2>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImportarPlanilha}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Busca de Produtos */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por Material, Descrição ou EAN"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={buscarProdutos}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Lista de Produtos */}
      {produtosFiltrados.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Produtos Encontrados</h3>
          <div className="space-y-2">
            {produtosFiltrados.map((produto, index) => (
              <div key={index} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{produto.material}</p>
                  <p className="text-sm">{produto.descricaoMaterial}</p>
                  <p className="text-sm">EAN: {produto.codigoEAN}</p>
                  <p className="text-sm">Estoque: {produto.estoque}</p>
                </div>
                <button
                  onClick={() => setOrcamento([...orcamento, produto])}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dados do Cliente */}
      {orcamento.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Dados do Cliente</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={dadosEmpresa.nomeCliente}
              onChange={(e) => setDadosEmpresa({...dadosEmpresa, nomeCliente: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="CNPJ/CPF"
              value={dadosEmpresa.cnpjCliente}
              onChange={(e) => setDadosEmpresa({...dadosEmpresa, cnpjCliente: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Contato"
              value={dadosEmpresa.contatoCliente}
              onChange={(e) => setDadosEmpresa({...dadosEmpresa, contatoCliente: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Observações"
              value={dadosEmpresa.observacoes}
              onChange={(e) => setDadosEmpresa({...dadosEmpresa, observacoes: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Botão Gerar Orçamento */}
      {orcamento.length > 0 && (
        <button
          onClick={() => setShowOrcamento(true)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Gerar Orçamento
        </button>
      )}

      {/* Modal do Orçamento */}
      {showOrcamento && <OrcamentoPreview />}

      {/* Estilos de Impressão */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .fixed.inset-0 {
            position: absolute;
            left: 0;
            top: 0;
          }
          .fixed.inset-0 * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default BudgetSystem;
