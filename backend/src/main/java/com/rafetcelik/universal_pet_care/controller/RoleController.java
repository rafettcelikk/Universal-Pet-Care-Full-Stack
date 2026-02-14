package com.rafetcelik.universal_pet_care.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rafetcelik.universal_pet_care.model.Role;
import com.rafetcelik.universal_pet_care.service.role.IRoleService;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(UrlMapping.ROLES)
public class RoleController {
	
	private final IRoleService roleService;
	
	@GetMapping(UrlMapping.GET_ALL_ROLES)
	public List<Role> getAllRoles() {
		return roleService.getAllRoles();
	}
	
	@GetMapping(UrlMapping.GET_ROLE_BY_ID)
	public Role getRoleById(Long id) {
		return roleService.getRoleById(id);
	}
	
	@GetMapping(UrlMapping.GET_ROLE_BY_NAME)
	public Role getRoleByName(String roleName) {
		return roleService.getRoleByName(roleName);
	}
	
}
