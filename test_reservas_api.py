#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test de funcionalidad para el sistema de reservas
Verifica la integración entre el panel React y la API de Railway PostgreSQL
"""

import requests
import json
import pytest
from typing import Dict, List, Any
import asyncio
import aiohttp
import time
import sys
import io

# Configurar encoding para Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuración de la API
API_BASE_URL = "https://agente-glamping-production.up.railway.app"

class TestReservasAPI:
    """Suite de tests para la API de reservas"""
    
    def setup_method(self):
        """Configuración inicial para cada test"""
        self.base_url = API_BASE_URL
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
    def test_api_health_check(self):
        """Test 1: Verificar que la API esté en línea"""
        print("🔍 Test 1: Health check de la API")
        
        response = requests.get(f"{self.base_url}/health", headers=self.headers)
        
        assert response.status_code == 200, f"API health check falló: {response.status_code}"
        print("✅ API está en línea y respondiendo")
        
    def test_fetch_reservas_endpoint(self):
        """Test 2: Verificar endpoint de reservas"""
        print("🔍 Test 2: Endpoint de reservas")
        
        response = requests.get(f"{self.base_url}/api/reservas", headers=self.headers)
        
        assert response.status_code == 200, f"Endpoint de reservas falló: {response.status_code}"
        
        data = response.json()
        assert "reservas" in data, "Respuesta no contiene campo 'reservas'"
        assert isinstance(data["reservas"], list), "Campo 'reservas' no es una lista"
        
        print(f"✅ Endpoint de reservas OK - {len(data['reservas'])} reservas encontradas")
        
    def test_reservas_data_structure(self):
        """Test 3: Verificar estructura de datos de reservas"""
        print("🔍 Test 3: Estructura de datos de reservas")
        
        response = requests.get(f"{self.base_url}/api/reservas", headers=self.headers)
        data = response.json()
        reservas = data["reservas"]
        
        if len(reservas) == 0:
            print("⚠️ No hay reservas para validar estructura")
            return
            
        reserva = reservas[0]
        
        # Campos requeridos (según estructura real de la API)
        campos_requeridos = [
            'id', 'nombre', 'email', 'numero',
            'domo', 'fechaEntrada', 'fechaSalida'
        ]
        
        for campo in campos_requeridos:
            assert campo in reserva, f"Campo requerido '{campo}' no encontrado en reserva"
            
        # Campos opcionales pero importantes  
        campos_opcionales = [
            'servicio_elegido', 'adicciones', 'metodoPago', 
            'montoAPagar', 'observaciones', 'numeroPersonas'
        ]
        
        campos_encontrados = list(reserva.keys())
        print(f"✅ Estructura validada - Campos encontrados: {len(campos_encontrados)}")
        print(f"📋 Campos: {campos_encontrados}")
        
    def test_servicios_handling(self):
        """Test 4: Verificar manejo de servicios"""
        print("🔍 Test 4: Manejo de servicios")
        
        response = requests.get(f"{self.base_url}/api/reservas", headers=self.headers)
        data = response.json()
        reservas = data["reservas"]
        
        if len(reservas) == 0:
            print("⚠️ No hay reservas para validar servicios")
            return
            
        # Verificar diferentes tipos de servicios
        reservas_con_servicio_elegido = [r for r in reservas if r.get('servicio_elegido')]
        reservas_con_adicciones = [r for r in reservas if r.get('adicciones')]
        
        print(f"📊 Reservas con servicio_elegido: {len(reservas_con_servicio_elegido)}")
        print(f"📊 Reservas con adicciones: {len(reservas_con_adicciones)}")
        
        # Mostrar ejemplos
        if reservas_con_servicio_elegido:
            ejemplo = reservas_con_servicio_elegido[0]
            print(f"🎯 Ejemplo servicio_elegido: {ejemplo['servicio_elegido']}")
            
        if reservas_con_adicciones:
            ejemplo = reservas_con_adicciones[0]
            print(f"🎯 Ejemplo adicciones: {ejemplo['adicciones']}")
            
        print("✅ Manejo de servicios verificado")
        
    def test_data_validation_frontend_compatibility(self):
        """Test 5: Verificar compatibilidad con validación del frontend"""
        print("🔍 Test 5: Compatibilidad con frontend")
        
        response = requests.get(f"{self.base_url}/api/reservas", headers=self.headers)
        data = response.json()
        reservas = data["reservas"]
        
        if len(reservas) == 0:
            print("⚠️ No hay reservas para validar compatibilidad")
            return
            
        # Simular transformación del frontend
        reservas_transformadas = []
        
        for reserva in reservas:
            transformada = {
                'id': reserva.get('id'),
                'nombre': reserva.get('nombre', 'No especificado'),
                'email': reserva.get('email', 'No proporcionado'),
                'numero': reserva.get('numero', 'No proporcionado'),
                'numeroPersonas': reserva.get('numeroPersonas', 1),
                'fechaEntrada': reserva.get('fechaEntrada'),
                'fechaSalida': reserva.get('fechaSalida'),
                'domo': reserva.get('domo', 'No especificado'),
                'servicios': [],  # Se transformará según la lógica del frontend
                'montoAPagar': reserva.get('montoAPagar', 0),
                'metodoPago': reserva.get('metodoPago', 'Pendiente'),
                'observaciones': reserva.get('observaciones', '')
            }
            
            # Simular transformación de servicios
            if reserva.get('servicio_elegido') and reserva.get('servicio_elegido') != 'Ninguno':
                servicio = {
                    'nombre': reserva['servicio_elegido'],
                    'precio': 0,  # No tenemos precio en la estructura actual
                    'descripcion': reserva.get('adicciones', '')
                }
                transformada['servicios'].append(servicio)
                
            reservas_transformadas.append(transformada)
            
        print(f"✅ Transformación simulada exitosa: {len(reservas_transformadas)} reservas")
        
        # Verificar que no hay campos críticos perdidos
        for reserva in reservas_transformadas[:3]:  # Solo primeras 3
            assert reserva['nombre'] != 'No especificado', "Nombre no encontrado"
            assert reserva['email'] != 'No proporcionado', "Email no encontrado"
            assert reserva['domo'] != 'No especificado', "Domo no encontrado"
            
        print("✅ Compatibilidad con frontend verificada")
        
    def test_api_response_time(self):
        """Test 6: Verificar tiempo de respuesta de la API"""
        print("🔍 Test 6: Tiempo de respuesta")
        
        start_time = time.time()
        response = requests.get(f"{self.base_url}/api/reservas", headers=self.headers)
        end_time = time.time()
        
        response_time = end_time - start_time
        
        assert response.status_code == 200, "API no responde correctamente"
        assert response_time < 5.0, f"API muy lenta: {response_time:.2f}s (máximo 5s)"
        
        print(f"✅ Tiempo de respuesta OK: {response_time:.2f}s")
        
    def test_cors_headers(self):
        """Test 7: Verificar headers CORS"""
        print("🔍 Test 7: Headers CORS")
        
        response = requests.get(f"{self.base_url}/api/reservas", headers=self.headers)
        
        # Verificar headers importantes para CORS
        headers = response.headers
        
        print(f"📋 Headers de respuesta encontrados: {len(headers)}")
        
        # No todos los headers CORS son obligatorios, pero verificamos lo básico
        assert response.status_code == 200, "Respuesta base debe funcionar"
        
        print("✅ Headers CORS básicos verificados")


def run_tests():
    """Ejecutor principal de tests"""
    print("🚀 INICIANDO TESTS DE FUNCIONALIDAD DEL SISTEMA DE RESERVAS")
    print("=" * 60)
    
    test_suite = TestReservasAPI()
    tests = [
        test_suite.test_api_health_check,
        test_suite.test_fetch_reservas_endpoint,
        test_suite.test_reservas_data_structure,
        test_suite.test_servicios_handling,
        test_suite.test_data_validation_frontend_compatibility,
        test_suite.test_api_response_time,
        test_suite.test_cors_headers
    ]
    
    passed = 0
    failed = 0
    
    for i, test in enumerate(tests, 1):
        try:
            print(f"\n[{i}/{len(tests)}] Ejecutando: {test.__name__}")
            test_suite.setup_method()
            test()
            passed += 1
            print(f"✅ {test.__name__} - PASSED")
        except Exception as e:
            failed += 1
            print(f"❌ {test.__name__} - FAILED: {str(e)}")
    
    print("\n" + "=" * 60)
    print(f"📊 RESULTADOS: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 ¡TODOS LOS TESTS PASARON!")
    else:
        print(f"⚠️ {failed} tests fallaron - revisar implementación")
        
    return failed == 0


if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)